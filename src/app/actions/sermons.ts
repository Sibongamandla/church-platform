"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const sermonSchema = z.object({
    title: z.string().min(1, "Title is required"),
    speaker: z.string().min(1, "Speaker is required"),
    series: z.string().optional(),
    description: z.string().optional(),
    videoUrl: z.string().url("Must be a valid URL"),
    thumbnailUrl: z.string().url().optional().or(z.literal("")),
    highlightQuote: z.string().optional(),
    highlightVideoUrl: z.string().url().optional().or(z.literal("")),
    date: z.string().min(1, "Date is required"),
});

export async function createSermonAction(formData: FormData): Promise<void> {
    await requireRole("SUPER_ADMIN");
    const data = Object.fromEntries(formData.entries());
    const parsed = sermonSchema.safeParse(data);
    if (!parsed.success) {
        console.error(parsed.error);
        return;
    }
    const { title, speaker, series, description, videoUrl, thumbnailUrl, highlightQuote, highlightVideoUrl, date } = parsed.data;
    await prisma.sermon.create({
        data: {
            title,
            speaker,
            series: series || null,
            description: description || null,
            videoUrl,
            thumbnailUrl: thumbnailUrl || null,
            highlightQuote: highlightQuote || null,
            highlightVideoUrl: highlightVideoUrl || null,
            date: new Date(date),
        },
    });
    revalidatePath("/admin/sermons");
    revalidatePath("/sermons");
    redirect("/admin/sermons");
}

export async function updateSermonAction(formData: FormData): Promise<void> {
    await requireRole("SUPER_ADMIN");
    const id = formData.get("id") as string;
    const data = Object.fromEntries(formData.entries());
    const parsed = sermonSchema.safeParse(data);
    if (!parsed.success) {
        console.error(parsed.error);
        return;
    }
    const { title, speaker, series, description, videoUrl, thumbnailUrl, highlightQuote, highlightVideoUrl, date } = parsed.data;
    await prisma.sermon.update({
        where: { id },
        data: {
            title,
            speaker,
            series: series || null,
            description: description || null,
            videoUrl,
            thumbnailUrl: thumbnailUrl || null,
            highlightQuote: highlightQuote || null,
            highlightVideoUrl: highlightVideoUrl || null,
            date: new Date(date),
        },
    });
    revalidatePath("/admin/sermons");
    revalidatePath("/sermons");
    redirect("/admin/sermons");
}

export async function deleteSermonAction(formData: FormData): Promise<void> {
    await requireRole("SUPER_ADMIN");
    const id = formData.get("id") as string;
    await prisma.sermon.delete({ where: { id } });
    revalidatePath("/admin/sermons");
    revalidatePath("/sermons");
}
