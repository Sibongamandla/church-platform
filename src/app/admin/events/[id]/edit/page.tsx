import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { EditEventForm } from "./EditEventForm";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const event = await prisma.event.findUnique({
        where: { id },
    });

    if (!event) notFound();

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">Edit Event</h1>
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 max-w-2xl">
                <EditEventForm event={event} />
            </div>
        </div>
    );
}
