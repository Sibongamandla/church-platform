"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { z } from "zod";

const groupSchema = z.object({
    name: z.string().min(1, "Name is required"),
    type: z.enum(["CELL", "MINISTRY"]),
    description: z.string().optional(),
});

export async function createMinistryGroupAction(prevState: any, formData: FormData) {
    await requireRole("SUPER_ADMIN");

    const data = Object.fromEntries(formData.entries());
    const parsed = groupSchema.safeParse(data);

    if (!parsed.success) {
        return { error: "Invalid input data" };
    }

    try {
        await prisma.ministryGroup.create({
            data: {
                name: parsed.data.name,
                type: parsed.data.type,
                description: parsed.data.description || null,
            },
        });
        
        revalidatePath("/admin/ministries");
        return { success: true };
    } catch (error) {
        console.error("Failed to create ministry group:", error);
        return { error: "Failed to create group" };
    }
}

export async function addGroupMemberAction(groupId: string, memberId: string, role: "LEADER" | "MEMBER" = "MEMBER") {
    // For V1 MVP, require admin to assign members.
    await requireRole("SUPER_ADMIN");

    try {
        await prisma.groupMember.create({
            data: {
                groupId,
                memberId,
                role,
            },
        });

        revalidatePath(`/admin/ministries/${groupId}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to add group member:", error);
        return { error: "Failed to add member" };
    }
}

export async function updateGroupMemberRoleAction(groupId: string, memberId: string, role: "LEADER" | "MEMBER") {
    await requireRole("SUPER_ADMIN");

    try {
        await prisma.groupMember.update({
            where: {
                groupId_memberId: {
                    groupId,
                    memberId,
                },
            },
            data: {
                role,
            },
        });

        revalidatePath(`/admin/ministries/${groupId}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to update group member role:", error);
        return { error: "Failed to update member role" };
    }
}

export async function removeGroupMemberAction(groupId: string, memberId: string) {
    await requireRole("SUPER_ADMIN");

    try {
        await prisma.groupMember.delete({
            where: {
                groupId_memberId: {
                    groupId,
                    memberId,
                },
            },
        });

        revalidatePath(`/admin/ministries/${groupId}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to remove group member:", error);
        return { error: "Failed to remove member" };
    }
}

export async function createGroupSessionAction(prevState: any, formData: FormData) {
    await requireRole("SUPER_ADMIN");
    
    const groupId = formData.get("groupId") as string;
    const dateStr = formData.get("date") as string;
    const topic = formData.get("topic") as string;

    if (!groupId || !dateStr) {
        return { error: "Group and Date are required" };
    }

    try {
        const session = await prisma.groupSession.create({
            data: {
                groupId,
                date: new Date(dateStr),
                topic: topic || null,
            },
        });

        revalidatePath(`/admin/ministries/${groupId}`);
        return { success: true, sessionId: session.id };
    } catch (error) {
        console.error("Failed to create group session:", error);
        return { error: "Failed to create session" };
    }
}

export async function recordGroupAttendanceAction(sessionId: string, memberIds: string[]) {
    await requireRole("SUPER_ADMIN");
    
    try {
        await prisma.$transaction(async (tx) => {
            await tx.groupAttendance.deleteMany({
                where: { sessionId }
            });

            if (memberIds.length > 0) {
                await tx.groupAttendance.createMany({
                    data: memberIds.map(memberId => ({
                        sessionId,
                        memberId,
                    }))
                });
            }
        });

        const session = await prisma.groupSession.findUnique({ where: { id: sessionId }});
        if (session) {
            revalidatePath(`/admin/ministries/${session.groupId}`);
            revalidatePath(`/admin/ministries/sessions/${sessionId}`);
        }
        
        return { success: true };
    } catch (error) {
        console.error("Failed to record group attendance:", error);
        return { error: "Failed to record attendance" };
    }
}
