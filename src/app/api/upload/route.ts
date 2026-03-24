import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
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

        const filename = `${crypto.randomUUID()}-${file.name.replace(/\s+/g, "-")}`;
        
        // Upload to Vercel Blob
        const blob = await put(filename, file, {
            access: "public",
        });

        return NextResponse.json({ 
            url: blob.url,
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
