import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { requireRole } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        await requireRole("CONTENT_EDITOR");

        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB
            return NextResponse.json({ error: "File size exceeds 10MB limit" }, { status: 413 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const filename = `${crypto.randomUUID()}-${file.name.replace(/\s+/g, "-")}`;
        const uploadDir = path.join(process.cwd(), "public/uploads");
        
        // Ensure directory exists
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            // Directory might already exist
        }

        const filePath = path.join(uploadDir, filename);
        await writeFile(filePath, buffer);

        return NextResponse.json({ 
            url: `/uploads/${filename}`,
            filename: file.name
        });
    } catch (error: any) {
        // Handle Next.js redirect errors (e.g., from requireRole)
        if (error.digest?.startsWith("NEXT_REDIRECT")) {
            throw error;
        }

        console.error("FULL UPLOAD ERROR:", error);
        
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ 
            error: "Upload failed", 
            details: errorMessage,
            stack: process.env.NODE_ENV === "development" ? error.stack : undefined
        }, { status: 500 });
    }
}
