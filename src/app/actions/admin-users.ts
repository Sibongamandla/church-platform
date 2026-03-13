"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword, requireRole } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createUserSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    role: z.enum(["SUPER_ADMIN", "CONTENT_EDITOR", "FINANCE_ADMIN", "REGISTRY_CLERK", "MEMBER"]),
});

export async function createAdminUserAction(prevState: any, formData: FormData) {
    const admin = await requireRole("SUPER_ADMIN");
    if (!admin) return { error: "Unauthorized" };

    const data = Object.fromEntries(formData.entries());
    const parsed = createUserSchema.safeParse(data);

    if (!parsed.success) {
        return { error: "Invalid input data" };
    }

    const { name, email, role } = parsed.data;

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return { error: "Email already in use" };
    }

    // Generate 6-digit temporary code
    const tempCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await hashPassword(tempCode);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role,
            setupRequired: true,
        },
    });

    // Link to Member Record if email matches
    const existingMember = await prisma.member.findFirst({
        where: { email }
    });

    if (existingMember) {
        await prisma.member.update({
            where: { id: existingMember.id },
            data: { userId: user.id }
        });
    }

    revalidatePath("/admin/settings/users");
    return { success: true, tempCode };
}

export async function deleteUserAction(prevState: any, formData: FormData) {
    const admin = await requireRole("SUPER_ADMIN");
    if (!admin) return { error: "Unauthorized" };

    const id = formData.get("id") as string;
    if (!id) return { error: "User ID required" };

    // Prevent self-deletion
    if (id === admin.id) {
        return { error: "Cannot delete your own account" };
    }

    await prisma.user.delete({
        where: { id },
    });

    revalidatePath("/admin/settings/users");
    return { success: true };
}

export async function updateUserRoleAction(prevState: any, formData: FormData) {
    const admin = await requireRole("SUPER_ADMIN");
    if (!admin) return { error: "Unauthorized" };

    const id = formData.get("id") as string;
    const role = formData.get("role") as any;

    if (!id || !role) return { error: "Invalid data" };

    await prisma.user.update({
        where: { id },
        data: { role },
    });

    revalidatePath("/admin/settings/users");
    return { success: true };
}
