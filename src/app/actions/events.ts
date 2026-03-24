"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { CACHE_TAGS } from "@/lib/cache";

const eventSchema = z.object({
    title: z.string().min(3),
    description: z.string().optional(),
    startDate: z.string(), // ISO string from form
    endDate: z.string(),   // ISO string from form
    location: z.string().optional(),
    imageUrl: z.string().url().optional().or(z.literal("")),
    isFeatured: z.boolean().default(false),
});

export async function createEventAction(prevState: any, formData: FormData) {
    // Check auth
    await requireRole("SUPER_ADMIN"); // Or CONTENT_EDITOR

    const data = {
        ...Object.fromEntries(formData.entries()),
        isFeatured: formData.get("isFeatured") === "on",
    };
    const parsed = eventSchema.safeParse(data);

    if (!parsed.success) {
        return { error: "Invalid input data" };
    }

    const { title, description, startDate, endDate, location, imageUrl, isFeatured } = parsed.data;

    try {
        await prisma.event.create({
            data: {
                title,
                description,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                location,
                imageUrl: imageUrl || null,
                isFeatured,
            },
        });
        revalidatePath("/", "layout");
        revalidatePath("/events", "layout");
    } catch (error) {
        return { error: "Failed to create event" };
    }

    revalidatePath("/admin/events");
    redirect("/admin/events");
}

export async function deleteEventAction(formData: FormData) {
    await requireRole("SUPER_ADMIN");

    const id = formData.get("id") as string;
    if (!id) return;

    await prisma.event.delete({
        where: { id },
    });

    revalidatePath("/", "layout");
    revalidatePath("/events", "layout");
    revalidatePath("/admin/events", "layout");
}

export async function updateEventAction(prevState: any, formData: FormData) {
    await requireRole("SUPER_ADMIN");

    const id = formData.get("id") as string;
    const data = {
        ...Object.fromEntries(formData.entries()),
        isFeatured: formData.get("isFeatured") === "on",
    };
    const parsed = eventSchema.safeParse(data);

    if (!parsed.success) {
        return { error: "Invalid input data" };
    }

    const { title, description, startDate, endDate, location, imageUrl, isFeatured } = parsed.data;

    try {
        await prisma.event.update({
            where: { id },
            data: {
                title,
                description,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                location,
                imageUrl: imageUrl || null,
                isFeatured,
            },
        });
    } catch (error) {
        return { error: "Failed to update event" };
    }

    revalidatePath("/", "layout");
    revalidatePath("/events", "layout");
    revalidatePath("/admin/events", "layout");
    redirect("/admin/events");
}

