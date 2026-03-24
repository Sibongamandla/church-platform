"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireRole, requireAuth } from "@/lib/auth";
import { z } from "zod";

export async function createTeamAction(prevState: any, formData: FormData) {
    await requireRole("SUPER_ADMIN");
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    if (!name) return { error: "Name is required" };

    try {
        await prisma.team.create({
            data: {
                name,
                description: description || null,
            },
        });
        revalidatePath("/admin/volunteers");
        return { success: true };
    } catch (error) {
        return { error: "Failed to create team" };
    }
}

export async function createTeamRoleAction(teamId: string, name: string) {
    await requireRole("SUPER_ADMIN");
    try {
        await prisma.teamRole.create({
            data: { teamId, name },
        });
        revalidatePath(`/admin/volunteers/${teamId}`);
        return { success: true };
    } catch (error) {
        return { error: "Failed to create role" };
    }
}

export async function assignTeamMemberAction(teamId: string, memberId: string, roleId?: string) {
    await requireRole("SUPER_ADMIN");
    try {
        await prisma.teamMember.upsert({
            where: {
                teamId_memberId: { teamId, memberId }
            },
            update: { roleId: roleId || null },
            create: {
                teamId,
                memberId,
                roleId: roleId || null,
            }
        });
        revalidatePath(`/admin/volunteers/${teamId}`);
        return { success: true };
    } catch (error) {
        return { error: "Failed to assign team member" };
    }
}

export async function removeTeamMemberAction(teamId: string, memberId: string) {
    await requireRole("SUPER_ADMIN");
    try {
        await prisma.teamMember.delete({
            where: {
                teamId_memberId: { teamId, memberId }
            }
        });
        revalidatePath(`/admin/volunteers/${teamId}`);
        return { success: true };
    } catch (error) {
        return { error: "Failed to remove team member" };
    }
}

export async function scheduleVolunteerAction(scheduleId: string, memberId: string, teamRoleId: string) {
    await requireRole("SUPER_ADMIN");
    try {
        await prisma.rosterAssignment.create({
            data: {
                scheduleId,
                memberId,
                teamRoleId,
                status: "PENDING"
            }
        });
        revalidatePath("/admin/volunteers/roster");
        return { success: true };
    } catch (error) {
        return { error: "Failed to create roster assignment" };
    }
}

export async function updateAssignmentStatusAction(assignmentId: string, status: "PENDING" | "CONFIRMED" | "DECLINED") {
    // Ideally this could be done by the member themselves
    try {
        await prisma.rosterAssignment.update({
            where: { id: assignmentId },
            data: { status }
        });
        revalidatePath("/admin/volunteers/roster");
        // Also revalidate member portal if we had one
        return { success: true };
    } catch (error) {
        return { error: "Failed to update assignment status" };
    }
}

export async function joinTeamAction(teamId: string) {
    const user = await requireAuth();
    if (!user) return { error: "You must be logged in to volunteer" };

    const member = await prisma.member.findUnique({
        where: { userId: user.id }
    });

    if (!member) {
        return { error: "Please complete your member profile first" };
    }

    try {
        await prisma.teamMember.upsert({
            where: {
                teamId_memberId: { teamId, memberId: member.id }
            },
            update: {}, // Ignore if already joined
            create: {
                teamId,
                memberId: member.id,
                roleId: null, // Default
            }
        });
        revalidatePath("/volunteer");
        return { success: true };
    } catch (error) {
        return { error: "Failed to join team" };
    }
}
