import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { SermonHighlightUI } from "@/components/admin/SermonHighlightUI";
import { requireRole } from "@/lib/auth";

export default async function SermonHighlightsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    await requireRole("CONTENT_EDITOR");

    const sermon = await (prisma as any).sermon.findUnique({
        where: { id },
    });

    if (!sermon) notFound();

    return (
        <div className="py-12">
            <SermonHighlightUI sermon={sermon} />
        </div>
    );
}
