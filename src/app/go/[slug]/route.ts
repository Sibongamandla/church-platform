import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    const link = await prisma.shortLink.findUnique({
        where: { slug },
    });

    if (!link) {
        return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    // Increment click count asynchronously (fire and forget to not slow down redirect too much, 
    // though Vercel/Next might kill generic promises. Better to await or use after() in Next 15, but for now simple await)
    await prisma.shortLink.update({
        where: { id: link.id },
        data: { clicks: { increment: 1 } },
    });

    return NextResponse.redirect(link.url);
}
