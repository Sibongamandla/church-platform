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

export async function scheduleVolunteerAction(scheduleId: string, memberId: string, teamRoleId: string, callTime?: string) {
    await requireRole("SUPER_ADMIN");
    try {
        await prisma.rosterAssignment.create({
            data: {
                scheduleId,
                memberId,
                teamRoleId,
                callTime: callTime || null,
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

export type VolunteerData = {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
};

export async function publicJoinTeamAction(teamId: string, memberId?: string, data?: VolunteerData) {
    try {
        let finalMemberId = memberId;

        // If memberId is provided, and we have data (phone), update the member's record
        if (finalMemberId && data?.phone) {
            await prisma.member.update({
                where: { id: finalMemberId },
                data: { phone: data.phone }
            });
        }

        // If no memberId, we create/find by phone (Quick Form)
        if (!finalMemberId && data) {
            const existing = await prisma.member.findFirst({
                where: { phone: data.phone }
            });

            if (existing) {
                finalMemberId = existing.id;
            } else {
                const newMember = await prisma.member.create({
                    data: {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        phone: data.phone,
                        email: data.email || null,
                        status: "ACTIVE",
                    }
                });
                finalMemberId = newMember.id;
            }
        }

        if (!finalMemberId) return { error: "Missing identity information" };

        await prisma.teamMember.upsert({
            where: {
                teamId_memberId: { teamId, memberId: finalMemberId }
            },
            update: {}, // Already joined
            create: {
                teamId,
                memberId: finalMemberId,
                roleId: null,
            }
        });

        revalidatePath("/volunteer");
        revalidatePath(`/admin/volunteers/${teamId}`);
        return { success: true };
    } catch (error) {
        console.error("Public volunteer error:", error);
        return { error: "Something went wrong while signing you up." };
    }
}

export async function linkTeamToSessionAction(teamId: string, sessionId: string) {
    await requireRole("SUPER_ADMIN");
    try {
        await prisma.serviceTeam.create({
            data: { teamId, sessionId }
        });
        revalidatePath(`/admin/volunteers/${teamId}`);
        revalidatePath(`/admin/volunteers/roster/${sessionId}`);
        return { success: true };
    } catch (error) {
        return { error: "Failed to link team to session" };
    }
}

export async function unlinkTeamFromSessionAction(teamId: string, sessionId: string) {
    await requireRole("SUPER_ADMIN");
    try {
        await prisma.serviceTeam.delete({
            where: {
                teamId_sessionId: { teamId, sessionId }
            }
        });
        revalidatePath(`/admin/volunteers/${teamId}`);
        revalidatePath(`/admin/volunteers/roster/${sessionId}`);
        return { success: true };
    } catch (error) {
        return { error: "Failed to unlink team from session" };
    }
}

export async function updateAssignmentStatusPublicAction(assignmentId: string, status: "CONFIRMED" | "DECLINED") {
    // This is public, no auth required, just a valid ID
    try {
        await prisma.rosterAssignment.update({
            where: { id: assignmentId },
            data: { status }
        });
        revalidatePath("/admin/volunteers/roster");
        return { success: true };
    } catch (error) {
        return { error: "Failed to update status" };
    }
}
