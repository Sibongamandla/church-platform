"use client";

import { useState } from "react";
import { List, Calendar as CalendarIcon, Calendar, MapPin, Trash2, Clock } from "lucide-react";
import { AdminCalendar } from "./AdminCalendar";
import Link from "next/link";
import { isAfter, isBefore, startOfDay } from "date-fns";

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
    const [listTab, setListTab] = useState<"upcoming" | "past">("upcoming");

    const now = startOfDay(new Date());
    
    const upcomingEvents = events.filter(e => {
        const eventDate = new Date(e.startDate);
        return isAfter(eventDate, now) || isSameDay(eventDate, now);
    });
    
    const pastEvents = events.filter(e => {
        const eventDate = new Date(e.startDate);
        return isBefore(eventDate, now) && !isSameDay(eventDate, now);
    });

    const displayEvents = listTab === "upcoming" ? upcomingEvents : pastEvents;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex bg-muted p-1 rounded-lg w-fit">
                    <button
                        onClick={() => setView("list")}
                        className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                            view === "list"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        <List className="h-4 w-4" />
                        List View
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

                {view === "list" && (
                    <div className="flex bg-muted p-1 rounded-lg w-fit">
                        <button
                            onClick={() => setListTab("upcoming")}
                            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                                listTab === "upcoming"
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            Upcoming
                            <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                                {upcomingEvents.length}
                            </span>
                        </button>
                        <button
                            onClick={() => setListTab("past")}
                            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                                listTab === "past"
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            Past
                            <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-muted-foreground/10 text-muted-foreground">
                                {pastEvents.length}
                            </span>
                        </button>
                    </div>
                )}
            </div>

            {view === "list" ? (
                <div className="grid gap-4">
                    {displayEvents.length === 0 ? (
                        <div className="text-center py-12 bg-card border rounded-xl shadow-sm">
                            <Clock className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                            <h3 className="text-lg font-semibold text-foreground">
                                No {listTab} events
                            </h3>
                            <p className="text-muted-foreground max-w-xs mx-auto mt-1">
                                {listTab === "upcoming" 
                                    ? "Stay tuned for future events or create one now." 
                                    : "There are no historical events recorded in the system yet."}
                            </p>
                        </div>
                    ) : (
                        displayEvents.map((event) => (
                            <div
                                key={event.id}
                                className="flex items-center justify-between p-4 bg-card border rounded-lg shadow-sm group hover:border-primary/50 transition-all"
                            >
                                <div className="space-y-1">
                                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                        {event.title}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {new Date(event.startDate).toLocaleDateString(undefined, { 
                                                weekday: 'short', 
                                                year: 'numeric', 
                                                month: 'short', 
                                                day: 'numeric' 
                                            })}
                                        </div>
                                        {event.location && (
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="h-3.5 w-3.5" />
                                                {event.location}
                                            </div>
                                        )}
                                        {listTab === "past" && (
                                            <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/60 bg-muted px-1.5 py-0.5 rounded">
                                                Past Event
                                            </span>
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

function isSameDay(d1: Date, d2: Date) {
    return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
    );
}
