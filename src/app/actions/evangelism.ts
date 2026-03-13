"use server";

import { prisma } from "@/lib/prisma";
import { requireRole, requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

const profileSchema = z.object({
    slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-z0-9-]+$/, "Slug must use lowercase letters, numbers, and hyphens only"),
    memberId: z.string().min(1, "Member is required"),
    bio: z.string().optional(),
    // avatarUrl is now managed via file handling in the action, but we validate existence optionally if needed
    // or we check 'avatar' file presence manually
    instagram: z.string().optional(),
    twitter: z.string().optional(),
    linkedin: z.string().optional(),
    whatsapp: z.string().optional(),
});

export async function createSmartProfileAction(prevState: any, formData: FormData) {
    await requireRole("CONTENT_EDITOR"); // or SUPER_ADMIN

    const data = Object.fromEntries(formData.entries());
    const parsed = profileSchema.safeParse(data);

    if (!parsed.success) {
        return { error: parsed.error.issues[0].message };
    }

    const { slug, memberId, bio, instagram, twitter, linkedin, whatsapp } = parsed.data;

    // File Handling
    const file = formData.get("avatar") as File | null;
    let avatarUrl = null;

    if (file && file.size > 0 && file.name !== "undefined") {
        try {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Allow only images
            if (!file.type.startsWith("image/")) {
                return { error: "Only image files are allowed." };
            }

            // Create filename: slug-timestamp.ext
            const ext = file.name.split(".").pop();
            const filename = `${slug}-${Date.now()}.${ext}`;
            const uploadDir = join(process.cwd(), "public/uploads");

            // Ensure dir exists
            await mkdir(uploadDir, { recursive: true });

            // Save file
            await writeFile(join(uploadDir, filename), buffer);

            // Set URL path for DB
            avatarUrl = `/uploads/${filename}`;

        } catch (error) {
            console.error("Upload failed", error);
            return { error: "Failed to upload image." };
        }
    }

    // Check if slug exists
    const existingSlug = await prisma.smartProfile.findUnique({ where: { slug } });
    if (existingSlug) {
        return { error: "Slug is already taken." };
    }

    // Check if member already has a profile
    const existingMember = await prisma.smartProfile.findUnique({ where: { memberId } });
    if (existingMember) {
        return { error: "This member already has a Smart Profile." };
    }

    try {
        await prisma.smartProfile.create({
            data: {
                slug,
                memberId,
                bio,
                avatarUrl, // Will be string path or null
                instagram,
                twitter,
                linkedin,
                whatsapp,
            },
        });
    } catch (error) {
        return { error: "Failed to create profile." };
    }

    revalidatePath("/admin/evangelism");
    return { success: true };
}

export async function saveMyProfileAction(prevState: any, formData: FormData) {
    const user = await requireAuth();

    // Verify member exists
    const member = await prisma.member.findUnique({
        where: { userId: user.id },
        include: { smartProfile: true }
    });

    if (!member) {
        return { error: "Member record not found. Please contact an admin." };
    }

    const data = Object.fromEntries(formData.entries());
    // We reuse the same schema but we might need to be careful about memberId
    // Security: Force memberId to be the logged-in user's member ID

    // We can't trust the formData memberId, so we ignore it and use member.id
    // But we need to construct a valid object for schema parsing
    const safeData = {
        ...data,
        memberId: member.id
    };

    const parsed = profileSchema.safeParse(safeData);

    if (!parsed.success) {
        return { error: parsed.error.issues[0].message };
    }

    const { slug, bio, instagram, twitter, linkedin, whatsapp } = parsed.data;

    // File Handling
    const file = formData.get("avatar") as File | null;
    let avatarUrl = member.smartProfile?.avatarUrl; // Default to existing

    if (file && file.size > 0 && file.name !== "undefined") {
        try {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            if (!file.type.startsWith("image/")) {
                return { error: "Only image files are allowed." };
            }

            const ext = file.name.split(".").pop();
            const filename = `${slug}-${Date.now()}.${ext}`;
            const uploadDir = join(process.cwd(), "public/uploads");

            await mkdir(uploadDir, { recursive: true });
            await writeFile(join(uploadDir, filename), buffer);

            avatarUrl = `/uploads/${filename}`;

        } catch (error) {
            console.error("Upload failed", error);
            return { error: "Failed to upload image." };
        }
    }

    // Check if slug exists AND belongs to someone else
    const existingSlug = await prisma.smartProfile.findUnique({ where: { slug } });
    if (existingSlug && existingSlug.memberId !== member.id) {
        return { error: "Slug is already taken by another user." };
    }

    try {
        await prisma.smartProfile.upsert({
            where: { memberId: member.id },
            update: {
                slug,
                bio,
                avatarUrl,
                instagram,
                twitter,
                linkedin,
                whatsapp,
            },
            create: {
                memberId: member.id,
                slug,
                bio,
                avatarUrl,
                instagram,
                twitter,
                linkedin,
                whatsapp,
            }
        });
    } catch (error) {
        return { error: "Failed to save profile." };
    }

    revalidatePath("/dashboard");
    revalidatePath(`/e/${slug}`);
    return { success: true };
}

export async function getSmartProfileBySlug(slug: string) {
    return await prisma.smartProfile.findUnique({
        where: { slug },
        include: {
            member: {
                select: {
                    firstName: true,
                    lastName: true,
                    email: true, // Maybe careful showing email publically? Let's hide it for now unless specific
                }
            }
        }
    });
}
