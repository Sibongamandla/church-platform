/**
 * Utility to generate calendar links for events
 */

export interface CalendarEvent {
    title: string;
    description: string;
    location: string;
    startDate: Date;
    endDate: Date;
}

export function generateGoogleCalendarLink(event: CalendarEvent): string {
    const fmt = (date: Date) => date.toISOString().replace(/-|:|\.\d+/g, "");
    
    const url = new URL("https://www.google.com/calendar/render");
    url.searchParams.append("action", "TEMPLATE");
    url.searchParams.append("text", event.title);
    url.searchParams.append("dates", `${fmt(event.startDate)}/${fmt(event.endDate)}`);
    url.searchParams.append("details", event.description);
    url.searchParams.append("location", event.location);
    
    return url.toString();
}

export function generateICalData(event: CalendarEvent): string {
    const fmt = (date: Date) => date.toISOString().replace(/-|:|\.\d+/g, "");
    
    return [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "BEGIN:VEVENT",
        `DTSTART:${fmt(event.startDate)}`,
        `DTEND:${fmt(event.endDate)}`,
        `SUMMARY:${event.title}`,
        `DESCRIPTION:${event.description.replace(/\n/g, "\\n")}`,
        `LOCATION:${event.location}`,
        "END:VEVENT",
        "END:VCALENDAR"
    ].join("\n");
}
