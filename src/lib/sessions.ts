import { startOfDay, endOfDay, isSunday, isWednesday, isFriday } from "date-fns";

export function getCurrentSessionName(date: Date = new Date()): string {
    if (isSunday(date)) {
        return "Sunday Service";
    }
    if (isWednesday(date)) {
        return "Mid-week Service";
    }
    if (isFriday(date)) {
        return "Friday Service";
    }
    return "Special Event";
}

export function getSessionDateRange(date: Date = new Date()) {
    return {
        start: startOfDay(date),
        end: endOfDay(date),
    };
}
