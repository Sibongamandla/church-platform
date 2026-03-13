"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword, createSession, deleteSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { z } from "zod";

const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export async function registerAction(prevState: any, formData: FormData) {
    const data = Object.fromEntries(formData.entries());
    const parsed = registerSchema.safeParse(data);

    if (!parsed.success) {
        return { error: "Invalid input data" };
    }

    const { name, email, password } = parsed.data;

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return { error: "Email already in use" };
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });

    // Link to Member Record
    // Check if a member with this email already exists
    const existingMember = await prisma.member.findFirst({
        where: { email }
    });

    if (existingMember) {
        // Link existing member
        await prisma.member.update({
            where: { id: existingMember.id },
            data: { userId: user.id }
        });
    } else {
        // Create new member record
        // Split name into First/Last loosely
        const nameParts = name.split(" ");
        const firstName = nameParts[0];
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "Member";

        await prisma.member.create({
            data: {
                firstName,
                lastName,
                email,
                userId: user.id,
                status: "ACTIVE"
            }
        });
    }

    // Automatically log in
    await createSession(user.id);

    redirect("/dashboard"); // Redirect to dashboard
}

export async function loginAction(prevState: any, formData: FormData) {
    const data = Object.fromEntries(formData.entries());
    const parsed = loginSchema.safeParse(data);

    if (!parsed.success) {
        return { error: "Invalid credentials" };
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        return { error: "Invalid credentials" };
    }

    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
        return { error: "Invalid credentials" };
    }

    await createSession(user.id);
    // Redirect to dashboard (which handles both members and admins)
    redirect("/dashboard");
}

export async function logoutAction() {
    await deleteSession();
    redirect("/login");
}
