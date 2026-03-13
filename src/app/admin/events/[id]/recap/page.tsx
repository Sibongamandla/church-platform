import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { EventRecapUI } from "@/components/admin/EventRecapUI";
import { requireRole } from "@/lib/auth";

export default async function EventRecapPage({ params }: { params: { id: string } }) {
    await requireRole("CONTENT_EDITOR");

    const event = await (prisma as any).event.findUnique({
        where: { id: params.id },
    });

    if (!event) notFound();

    return (
        <div className="py-12">
            <EventRecapUI event={event} />
        </div>
    );
}
