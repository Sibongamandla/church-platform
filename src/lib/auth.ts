import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { User } from "@prisma/client";

export type Role = "SUPER_ADMIN" | "CONTENT_EDITOR" | "FINANCE_ADMIN" | "REGISTRY_CLERK" | "MEMBER";

export async function hashPassword(password: string) {
    return await bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
}

export async function createSession(userId: string) {
    const sessionToken = crypto.randomUUID();
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await prisma.session.create({
        data: {
            userId,
            sessionToken,
            expires,
        },
    });

    const cookieStore = await cookies();
    cookieStore.set("session_token", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires,
        sameSite: "lax",
        path: "/",
    });
}

export async function deleteSession() {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session_token")?.value;

    if (sessionToken) {
        await prisma.session.deleteMany({
            where: { sessionToken },
        });
    }

    cookieStore.delete("session_token");
}

export async function getSession() {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session_token")?.value;

    if (!sessionToken) return null;

    const session = await prisma.session.findUnique({
        where: { sessionToken },
        include: { user: true },
    });

    if (!session || session.expires < new Date()) {
        return null;
    }

    return session;
}

export async function getCurrentUser() {
    const session = await getSession();
    return session?.user;
}

export async function requireAuth() {
    const user = await getCurrentUser();
    if (!user) {
        redirect("/login");
    }
    return user;
}

export async function requireRole(role: Role) {
    const user = await requireAuth();
    if (user.role !== role && user.role !== "SUPER_ADMIN") {
        redirect("/"); // Or unauthorized page
    }
    return user;
}
