"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentSessionName } from "@/lib/sessions";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { redirect } from "next/navigation";

// NOTE: These are public actions for kiosk/self-service.
// We remove strict role checks but ensure logic is safe.

export async function checkInMemberAction(memberId: string) {
    const today = new Date();
    const sessionName = getCurrentSessionName(today);

    // Check if member exists first
    const member = await prisma.member.findUnique({ where: { id: memberId } });
    if (!member) return { error: "Member not found." };

    // Check if already checked in today for this service
    const existing = await prisma.attendance.findFirst({
        where: {
            memberId,
            serviceId: sessionName,
            date: {
                gte: new Date(today.setHours(0, 0, 0, 0)),
                lt: new Date(today.setHours(23, 59, 59, 999)),
            }
        }
    });

    if (existing) {
        return { success: true, message: "Already checked in." }; // Treat as success to avoid confusion
    }

    try {
        await prisma.attendance.create({
            data: {
                date: new Date(),
                serviceId: sessionName,
                memberId,
            }
        });

        revalidatePath("/admin/attendance");
        return { success: true, message: "Check-in successful!" };
    } catch (e) {
        return { error: "Check-in failed." };
    }
}

export async function searchMembersForKioskAction(query: string) {
    if (!query || query.length < 2) return [];

    // Simple search
    return await prisma.member.findMany({
        where: {
            OR: [
                { firstName: { contains: query } },
                { lastName: { contains: query } },
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
            status: true
        }
    });
}

const visitorSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phone: z.string().min(8, "Valid phone number required"),
    email: z.string().email().optional().or(z.literal("")),
    gender: z.enum(["Male", "Female"]).optional(),
    birthday: z.string().optional(), // YYYY-MM-DD
    recruiterSlug: z.string().optional(),
});

export async function registerVisitorAction(formData: FormData) {
    const data = Object.fromEntries(formData.entries());
    const parsed = visitorSchema.safeParse(data);

    if (!parsed.success) {
        console.error(parsed.error);
        return;
    }

    const { firstName, lastName, phone, email, gender, birthday, recruiterSlug } = parsed.data;

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

    try {
        // check for existing member by phone
        let member = await prisma.member.findFirst({
            where: { phone }
        });

        if (member) {
            // Member exists, just check them in
            await checkInMemberAction(member.id);
        } else {
            // Create new member
            member = await prisma.member.create({
                data: {
                    firstName,
                    lastName,
                    phone,
                    email: email || null,
                    gender: gender || null,
                    birthday: birthday ? new Date(birthday) : null,
                    status: "ACTIVE",
                    recruitedById, // Link referrer
                }
            });

            // Check them in immediately
            await checkInMemberAction(member.id);
        }

    } catch (error) {
        console.error(error);
        return; // Or handle error
    }

    // Redirect or revalidate OUTSIDE try/catch to allow NEXT_REDIRECT to throw
    redirect("/check-in?success=true");
}
