"use client";

import { useState } from "react";
import { List, Calendar as CalendarIcon } from "lucide-react";
import { AdminCalendar } from "./AdminCalendar";
import Link from "next/link";
import { Calendar, MapPin, Trash2 } from "lucide-react";

interface Event {
    id: string;
    title: string;
    startDate: Date;
    location?: string | null;
}

interface EventsViewToggleProps {
    events: Event[];
    deleteAction: (formData: FormData) => Promise<void>;
}

export function EventsViewToggle({ events, deleteAction }: EventsViewToggleProps) {
    const [view, setView] = useState<"list" | "calendar">("list");

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex bg-muted p-1 rounded-lg">
                    <button
                        onClick={() => setView("list")}
                        className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                            view === "list"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        <List className="h-4 w-4" />
                        List
                    </button>
                    <button
                        onClick={() => setView("calendar")}
                        className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                            view === "calendar"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        <CalendarIcon className="h-4 w-4" />
                        Calendar
                    </button>
                </div>
            </div>

            {view === "list" ? (
                <div className="grid gap-4">
                    {events.length === 0 ? (
                        <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed text-card-foreground shadow-sm">
                            <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                            <h3 className="mt-2 text-sm font-semibold text-foreground">No events</h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Get started by creating a new event.
                            </p>
                        </div>
                    ) : (
                        events.map((event) => (
                            <div
                                key={event.id}
                                className="flex items-center justify-between p-4 bg-card border rounded-lg shadow-sm text-card-foreground"
                            >
                                <div className="space-y-1">
                                    <h3 className="font-semibold text-foreground">{event.title}</h3>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(event.startDate).toLocaleDateString()}
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
                                    <form action={deleteAction}>
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
            ) : (
                <AdminCalendar events={events} />
            )}
        </div>
    );
}
