"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireRole } from "@/lib/auth";

const memberSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().optional(),
    address: z.string().optional(),
    birthday: z.string().optional(), // ISO date string
    gender: z.string().optional(),
    status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]).default("ACTIVE"),
});

export async function createMemberAction(prevState: any, formData: FormData) {
    await requireRole("REGISTRY_CLERK");

    const data = Object.fromEntries(formData.entries());
    const parsed = memberSchema.safeParse(data);

    if (!parsed.success) {
        return { error: "Invalid input data" };
    }

    const { firstName, lastName, email, phone, address, birthday, gender, status } = parsed.data;

    try {
        await prisma.member.create({
            data: {
                firstName,
                lastName,
                email: email || null,
                phone: phone || null,
                address: address || null,
                birthday: birthday ? new Date(birthday) : null,
                gender: gender || null,
                status,
            },
        });
    } catch (error) {
        return { error: "Failed to create member" };
    }

    revalidatePath("/admin/members");
    redirect("/admin/members");
}

export async function updateMemberAction(prevState: any, formData: FormData) {
    await requireRole("REGISTRY_CLERK");

    const id = formData.get("id") as string;
    if (!id) return { error: "Missing member ID" };

    const data = Object.fromEntries(formData.entries());
    const parsed = memberSchema.safeParse(data);

    if (!parsed.success) {
        return { error: "Invalid input data" };
    }

    const { firstName, lastName, email, phone, address, birthday, gender, status } = parsed.data;

    try {
        await prisma.member.update({
            where: { id },
            data: {
                firstName,
                lastName,
                email: email || null,
                phone: phone || null,
                address: address || null,
                birthday: birthday ? new Date(birthday) : null,
                gender: gender || null,
                status,
            }
        });
    } catch (error) {
        return { error: "Failed to update member" };
    }

    revalidatePath(`/admin/members/${id}`);
    revalidatePath("/admin/members");
    redirect(`/admin/members/${id}`);
}

export async function deleteMemberAction(formData: FormData) {
    await requireRole("SUPER_ADMIN");

    const id = formData.get("id") as string;
    if (!id) return;

    await prisma.member.delete({
        where: { id },
    });

    revalidatePath("/admin/members");
}
