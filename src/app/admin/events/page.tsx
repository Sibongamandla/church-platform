import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import { deleteEventAction } from "@/app/actions/events";
import { EventsViewToggle } from "@/components/admin/EventsViewToggle";

export default async function EventsAdminPage() {
    const events = await prisma.event.findMany({
        orderBy: { startDate: "asc" },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Events</h1>
                    <p className="text-muted-foreground text-sm">Manage church events and schedules.</p>
                </div>
                <Link
                    href="/admin/events/new"
                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Event
                </Link>
            </div>

            <EventsViewToggle events={events} deleteAction={deleteEventAction} />
        </div>
    );
}
