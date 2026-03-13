import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Calendar, MapPin, Trash2 } from "lucide-react";
import { deleteEventAction } from "@/app/actions/events";

export default async function EventsAdminPage() {
    const events = await prisma.event.findMany({
        orderBy: { startDate: "asc" },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Events</h1>
                <Link
                    href="/admin/events/new"
                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Event
                </Link>
            </div>

            <div className="grid gap-4">
                {events.length === 0 ? (
                    <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed">
                        <h3 className="mt-2 text-sm font-semibold text-foreground">No events</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Get started by creating a new event.
                        </p>
                    </div>
                ) : (
                    events.map((event) => (
                        <div
                            key={event.id}
                            className="flex items-center justify-between p-4 bg-card border rounded-lg shadow-sm"
                        >
                            <div className="space-y-1">
                                <h3 className="font-semibold">{event.title}</h3>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {event.startDate.toLocaleDateString()}
                                    </div>
                                    {event.location && (
                                        <div className="flex items-center gap-1">
                                            <MapPin className="h-3 w-3" />
                                            {event.location}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Link
                                    href={`/admin/events/${event.id}/edit`}
                                    className="px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 rounded-md transition-colors"
                                >
                                    Edit
                                </Link>
                                <form action={deleteEventAction}>
                                    <input type="hidden" name="id" value={event.id} />
                                    <button
                                        type="submit"
                                        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                                    >
                                        <span className="sr-only">Delete</span>
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </form>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
