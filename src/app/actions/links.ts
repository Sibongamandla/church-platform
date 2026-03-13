"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const linkSchema = z.object({
    slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
    url: z.string().url(),
});

export async function createLinkAction(prevState: any, formData: FormData) {
    await requireRole("CONTENT_EDITOR");

    const data = Object.fromEntries(formData.entries());
    const parsed = linkSchema.safeParse(data);

    if (!parsed.success) {
        return { error: "Invalid input: " + parsed.error.issues.map(i => i.message).join(", ") };
    }

    const { slug, url } = parsed.data;

    const existing = await prisma.shortLink.findUnique({ where: { slug } });
    if (existing) {
        return { error: "Slug already exists." };
    }

    await prisma.shortLink.create({
        data: { slug, url },
    });

    revalidatePath("/admin/links");
    redirect("/admin/links");
}

export async function deleteLinkAction(formData: FormData) {
    await requireRole("CONTENT_EDITOR");
    const id = formData.get("id") as string;
    if (!id) return;

    await prisma.shortLink.delete({ where: { id } });
    revalidatePath("/admin/links");
}
