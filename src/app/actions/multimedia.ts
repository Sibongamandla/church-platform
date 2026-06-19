"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireRole } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

const recapSchema = z.object({
    eventId: z.string(),
    recapContent: z.string().min(10),
    recapImages: z.string().optional(), // Comma separated URLs
});

export async function updateEventRecapAction(prevState: any, formData: FormData) {
    const user = await requireRole('CONTENT_EDITOR');

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

        await logAuditEvent({ userId: user.id, action: 'CONTENT_UPDATE', resource: 'media', details: { type: 'event_recap', eventId } });

        revalidatePath("/", "layout");
        revalidatePath("/events", "layout");
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
    const user = await requireRole('CONTENT_EDITOR');

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

        await logAuditEvent({ userId: user.id, action: 'CONTENT_UPDATE', resource: 'media', details: { type: 'sermon_highlight', sermonId } });

        revalidatePath("/", "layout");
        revalidatePath("/sermons", "layout");
        return { success: true };
    } catch (error) {
        console.error("Failed to update highlight:", error);
        return { error: "Failed to save highlight." };
    }
}
