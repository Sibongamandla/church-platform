"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword, createSession, deleteSession, getCurrentUser } from "@/lib/auth";
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
    // Public registration is disabled
    return { error: "Public registration is disabled. Please contact an administrator." };
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

    // Check if the user needs to set their password (onboarding)
    if (user.setupRequired) {
        redirect("/setup-password");
    }

    const adminRoles = ["SUPER_ADMIN", "CONTENT_EDITOR", "FINANCE_ADMIN", "REGISTRY_CLERK"];
    if (adminRoles.includes(user.role)) {
        redirect("/admin");
    }
    redirect("/dashboard");
}

const setupSchema = z.object({
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export async function setupPasswordAction(prevState: any, formData: FormData) {
    const user = await getCurrentUser();
    if (!user || !user.setupRequired) {
        redirect("/login");
    }

    const data = Object.fromEntries(formData.entries());
    const parsed = setupSchema.safeParse(data);

    if (!parsed.success) {
        return { error: parsed.error.issues[0].message };
    }

    const hashedPassword = await hashPassword(parsed.data.password);

    await prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            setupRequired: false,
        },
    });

    const adminRoles = ["SUPER_ADMIN", "CONTENT_EDITOR", "FINANCE_ADMIN", "REGISTRY_CLERK"];
    if (adminRoles.includes(user.role)) {
        redirect("/admin");
    }
    redirect("/dashboard");
}

export async function logoutAction() {
    await deleteSession();
    redirect("/login");
}
