"use server";

import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache";
import { z } from "zod";

const recapSchema = z.object({
    eventId: z.string(),
    recapContent: z.string().min(10),
    recapImages: z.string().optional(), // Comma separated URLs
});

export async function updateEventRecapAction(prevState: any, formData: FormData) {
    const data = Object.fromEntries(formData.entries());
    const parsed = recapSchema.safeParse(data);

    if (!parsed.success) {
        return { error: "Invalid data. Content must be at least 10 characters." };
    }

    const { eventId, recapContent, recapImages } = parsed.data;
    const imagesArray = recapImages ? recapImages.split(",").map(url => url.trim()) : [];

    try {
        await (prisma as any).event.update({
            where: { id: eventId },
            data: {
                recapContent,
                recapImages: imagesArray,
            },
        });

        revalidateTag(CACHE_TAGS.events);
        return { success: true };
    } catch (error) {
        console.error("Failed to update recap:", error);
        return { error: "Failed to save recap." };
    }
}

const highlightSchema = z.object({
    sermonId: z.string(),
    highlightQuote: z.string().optional(),
    highlightVideoUrl: z.string().url().optional().or(z.literal("")),
});

export async function updateSermonHighlightAction(prevState: any, formData: FormData) {
    const data = Object.fromEntries(formData.entries());
    const parsed = highlightSchema.safeParse(data);

    if (!parsed.success) {
        return { error: "Invalid data. Please provide a valid URL." };
    }

    const { sermonId, highlightQuote, highlightVideoUrl } = parsed.data;

    try {
        await (prisma as any).sermon.update({
            where: { id: sermonId },
            data: {
                highlightQuote,
                highlightVideoUrl,
            },
        });

        revalidateTag(CACHE_TAGS.sermons);
        return { success: true };
    } catch (error) {
        console.error("Failed to update highlight:", error);
        return { error: "Failed to save highlight." };
    }
}
