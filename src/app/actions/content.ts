"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const slideSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1),
    subtitle: z.string().optional(),
    imageUrl: z.string().url(),
    link: z.string().optional(),
    order: z.number().int().default(0),
    isActive: z.boolean().default(true),
});

export async function upsertHomeSlideAction(prevState: any, formData: FormData) {
    const data = {
        id: formData.get("id") as string || undefined,
        title: formData.get("title") as string,
        subtitle: formData.get("subtitle") as string,
        imageUrl: formData.get("imageUrl") as string,
        link: formData.get("link") as string,
        order: parseInt(formData.get("order") as string || "0"),
        isActive: formData.get("isActive") === "on",
    };

    const parsed = slideSchema.safeParse(data);
    if (!parsed.success) {
        return { error: "Invalid data. Please provide a valid Title and Image URL." };
    }

    try {
        if (data.id) {
            await prisma.homeSlide.update({
                where: { id: data.id },
                data: parsed.data,
            });
        } else {
            await prisma.homeSlide.create({
                data: parsed.data,
            });
        }

        revalidatePath("/");
        revalidatePath("/admin/content");
        return { success: true };
    } catch (error) {
        console.error("Failed to save slide:", error);
        return { error: "Failed to save slide." };
    }
}

export async function deleteHomeSlideAction(id: string) {
    try {
        await prisma.homeSlide.delete({ where: { id } });
        revalidatePath("/");
        revalidatePath("/admin/content");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete slide:", error);
        return { error: "Failed to delete slide." };
    }
}
