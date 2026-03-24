"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { CACHE_TAGS } from "@/lib/cache";

const announcementSchema = z.object({
    title: z.string().min(3),
    content: z.string().min(5),
    date: z.string(), // ISO string from form
    imageUrl: z.string().url().optional().or(z.literal("")),
    category: z.string().default("General"),
});

export async function createAnnouncementAction(prevState: any, formData: FormData) {
    await requireRole("SUPER_ADMIN"); // Or CONTENT_EDITOR

    const data = Object.fromEntries(formData.entries());
    const parsed = announcementSchema.safeParse(data);

    if (!parsed.success) {
        return { error: "Invalid input data" };
    }

    const { title, content, date, imageUrl, category } = parsed.data;

    try {
        await prisma.announcement.create({
            data: {
                title,
                content,
                date: new Date(date),
                imageUrl: imageUrl || null,
                category,
            },
        });
        revalidatePath("/", "layout");
        revalidatePath("/announcements", "layout");
    } catch (error) {
        return { error: "Failed to create announcement" };
    }

    revalidatePath("/admin/announcements");
    redirect("/admin/announcements");
}

export async function deleteAnnouncementAction(formData: FormData) {
    await requireRole("SUPER_ADMIN");

    const id = formData.get("id") as string;
    if (!id) return;

    await prisma.announcement.delete({
        where: { id },
    });

    revalidatePath("/", "layout");
    revalidatePath("/announcements", "layout");
    revalidatePath("/admin/announcements", "layout");
}

export async function updateAnnouncementAction(prevState: any, formData: FormData) {
    await requireRole("SUPER_ADMIN");

    const id = formData.get("id") as string;
    const data = Object.fromEntries(formData.entries());
    const parsed = announcementSchema.safeParse(data);

    if (!parsed.success) {
        return { error: "Invalid input data" };
    }

    const { title, content, date, imageUrl, category } = parsed.data;

    try {
        await prisma.announcement.update({
            where: { id },
            data: {
                title,
                content,
                date: new Date(date),
                imageUrl: imageUrl || null,
                category,
            },
        });
    } catch (error) {
        return { error: "Failed to update announcement" };
    }

    revalidatePath("/", "layout");
    revalidatePath("/announcements", "layout");
    revalidatePath("/admin/announcements", "layout");
    redirect("/admin/announcements");
}

