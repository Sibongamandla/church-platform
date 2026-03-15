"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentSessionName, getActiveSession } from "@/lib/sessions";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { redirect } from "next/navigation";

// NOTE: These are public actions for kiosk/self-service.
// We remove strict role checks but ensure logic is safe.

export async function checkInMultipleMembersAction(memberIds: string[]) {
    const today = new Date();
    const sessionName = getCurrentSessionName(today);
    const activeSession = await getActiveSession(today);

    try {
        // Filter out already checked-in members
        const checkedInToday = await prisma.attendance.findMany({
            where: {
                memberId: { in: memberIds },
                serviceId: sessionName,
                date: {
                    gte: new Date(new Date(today).setHours(0, 0, 0, 0)),
                    lt: new Date(new Date(today).setHours(23, 59, 59, 999)),
                }
            },
            select: { memberId: true }
        });

        const checkedInIds = new Set(checkedInToday.map(a => a.memberId));
        const toCheckIn = memberIds.filter(id => !checkedInIds.has(id));

        if (toCheckIn.length === 0) {
             return { success: true, message: "Everyone was already checked in." };
        }

        // Create attendance records
        await prisma.attendance.createMany({
            data: toCheckIn.map(memberId => ({
                date: new Date(),
                serviceId: sessionName,
                memberId,
                sessionId: activeSession?.id || null,
            }))
        });

        // Update headcount if there's an active session
        if (activeSession) {
            await prisma.serviceSession.update({
                where: { id: activeSession.id },
                data: {
                    headcount: {
                        increment: toCheckIn.length
                    }
                }
            });
        }

        revalidatePath("/admin/attendance");
        return { success: true, message: "Check-in successful!" };
    } catch (e) {
        console.error("Check-in error:", e);
        return { error: "Check-in failed." };
    }
}

export async function checkInMemberAction(memberId: string) {
    return checkInMultipleMembersAction([memberId]);
}

export async function searchMembersForKioskAction(query: string) {
    if (!query || query.length < 2) return [];

    // Simple search
    const results = await prisma.member.findMany({
        where: {
            OR: [
                { firstName: { contains: query, mode: 'insensitive' } },
                { lastName: { contains: query, mode: 'insensitive' } },
                { phone: { contains: query } }
            ],
            status: "ACTIVE"
        },
        take: 5, // Limit results for privacy in public kiosk
        select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            email: true,
            status: true,
            familyId: true,
            family: {
                select: {
                    members: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            phone: true,
                        }
                    }
                }
            }
        }
    });

    return results;
}

const visitorSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phone: z.string().min(8, "Valid phone number required"),
    email: z.string().email().optional().or(z.literal("")),
    gender: z.enum(["Male", "Female"]).optional(),
    birthday: z.string().optional(), // YYYY-MM-DD
    recruiterSlug: z.string().optional(),
    familyMembersJSON: z.string().optional() // JSON string representation of family members
});

export async function registerVisitorAction(formData: FormData) {
    const data = Object.fromEntries(formData.entries());
    const parsed = visitorSchema.safeParse(data);

    if (!parsed.success) {
        console.error(parsed.error);
        return;
    }

    const { firstName, lastName, phone, email, gender, birthday, recruiterSlug, familyMembersJSON } = parsed.data;

    let recruitedById = null;
    if (recruiterSlug) {
        const profile = await prisma.smartProfile.findUnique({
            where: { slug: recruiterSlug },
            include: { member: true }
        });
        if (profile) {
            recruitedById = profile.memberId;
        }
    }

    let familyMembers: any[] = [];
    if (familyMembersJSON) {
        try {
            familyMembers = JSON.parse(familyMembersJSON);
        } catch (e) {
            console.error("Failed to parse family members JSON");
        }
    }

    let primaryMemberId: string | undefined;
    let allCheckInIds: string[] = [];

    try {
        // check for existing member by phone
        let member = await prisma.member.findFirst({
            where: { phone }
        });

        // 1. Create/Find Primary Member and Create Family Record
        let familyId = member?.familyId;

        if (!member) {
             member = await prisma.member.create({
                data: {
                    firstName,
                    lastName,
                    phone,
                    email: email || null,
                    gender: gender || null,
                    birthday: birthday ? new Date(birthday) : null,
                    status: "ACTIVE",
                    recruitedById, 
                }
            });
        }
        
        primaryMemberId = member.id;
        allCheckInIds.push(member.id);

        if (familyMembers.length > 0) {
             // Create family if it doesn't exist
             if (!familyId) {
                  const family = await prisma.family.create({
                       data: { name: `${lastName} Family` }
                  });
                  familyId = family.id;
                  
                  // Link primary member to new family
                  await prisma.member.update({
                       where: { id: primaryMemberId },
                       data: { familyId }
                  });
             }

             // Create family relatives
             for (const relative of familyMembers) {
                 if (!relative.firstName) continue;
                 
                  const relMember = await prisma.member.create({
                       data: {
                            firstName: relative.firstName,
                            lastName: relative.lastName || lastName,
                            gender: relative.gender || null,
                            birthday: relative.birthday ? new Date(relative.birthday) : null,
                            familyId,
                            status: "ACTIVE",
                            recruitedById
                       }
                  });
                  allCheckInIds.push(relMember.id);
             }
        }

        // Check everyone in
        await checkInMultipleMembersAction(allCheckInIds);

    } catch (error) {
        console.error(error);
        return; 
    }

    // Redirect or revalidate OUTSIDE try/catch to allow NEXT_REDIRECT to throw
    redirect("/check-in?success=true");
}
