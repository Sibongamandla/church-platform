"use client";

import { useState } from "react";
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    isSameMonth,
    isSameDay,
    addDays,
    eachDayOfInterval,
} from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin } from "lucide-react";
import Link from "next/link";

interface Event {
    id: string;
    title: string;
    startDate: Date;
    location?: string | null;
}

interface AdminCalendarProps {
    events: Event[];
}

export function AdminCalendar({ events }: AdminCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const onNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const onPrevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({
        start: startDate,
        end: endDate,
    });

    const getEventsForDay = (day: Date) => {
        return events.filter((event) => isSameDay(new Date(event.startDate), day));
    };

    return (
        <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
            {/* Calendar Header */}
            <div className="flex items-center justify-between p-4 border-b bg-muted/30">
                <div className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold capitalize">
                        {format(currentDate, "MMMM yyyy")}
                    </h2>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={onPrevMonth}
                        className="p-2 hover:bg-muted rounded-md transition-colors"
                        aria-label="Previous month"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => setCurrentDate(new Date())}
                        className="px-3 py-1 text-sm font-medium hover:bg-muted rounded-md transition-colors"
                    >
                       Today
                    </button>
                    <button
                        onClick={onNextMonth}
                        className="p-2 hover:bg-muted rounded-md transition-colors"
                        aria-label="Next month"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Weekdays Header */}
            <div className="grid grid-cols-7 border-b bg-muted/10">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div
                        key={day}
                        className="py-2 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 bg-muted/5">
                {calendarDays.map((day, idx) => {
                    const dayEvents = getEventsForDay(day);
                    const isToday = isSameDay(day, new Date());
                    const isCurrentMonth = isSameMonth(day, monthStart);

                    return (
                        <div
                            key={idx}
                            className={`min-h-[120px] border-r border-b p-2 transition-colors hover:bg-muted/20 ${
                                !isCurrentMonth ? "opacity-40" : ""
                            }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span
                                    className={`text-sm font-medium h-7 w-7 flex items-center justify-center rounded-full ${
                                        isToday
                                            ? "bg-primary text-primary-foreground"
                                            : "text-muted-foreground"
                                    }`}
                                >
                                    {format(day, "d")}
                                </span>
                            </div>
                            <div className="space-y-1">
                                {dayEvents.map((event) => (
                                    <Link
                                        key={event.id}
                                        href={`/admin/events/${event.id}/edit`}
                                        className="block p-1 text-[10px] leading-tight font-medium bg-primary/10 text-primary rounded border border-primary/20 hover:bg-primary/20 transition-colors truncate"
                                        title={event.title}
                                    >
                                        {event.title}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
