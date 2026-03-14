import { startOfDay, endOfDay, isSunday, isWednesday, isFriday, addMinutes, subMinutes, isAfter, isBefore } from "date-fns";
import { prisma } from "./prisma";

export type SessionConfig = {
    name: string;
    startTime: string; // HH:mm
    day: number; // 0-6
};

export const AUTOMATIC_SESSIONS: SessionConfig[] = [
    { name: "Sunday Service", startTime: "09:00", day: 0 },
    { name: "Mid-week Service", startTime: "18:00", day: 3 },
    { name: "Friday Service", startTime: "18:00", day: 5 },
];

export async function getActiveSession(date: Date = new Date()) {
    const day = date.getDay();
    const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

    // 1. Check for manual sessions first
    const manualSession = await prisma.serviceSession.findFirst({
        where: {
            type: "MANUAL",
            startTime: { lte: date },
            endTime: { gte: date },
        },
    });

    if (manualSession) return manualSession;

    // 2. Check for automatic sessions
    const config = AUTOMATIC_SESSIONS.find(s => s.day === day);
    if (config) {
        const [hours, minutes] = config.startTime.split(':').map(Number);
        const sessionStart = new Date(date);
        sessionStart.setHours(hours, minutes, 0, 0);

        const windowOpen = subMinutes(sessionStart, 30);
        const windowClose = addMinutes(sessionStart, 60);

        if (isAfter(date, windowOpen) && isBefore(date, windowClose)) {
            // Find or create the automatic session record for today
            return await prisma.serviceSession.upsert({
                where: {
                    name_date: {
                        name: config.name,
                        date: startOfDay(date),
                    }
                },
                update: {
                    startTime: sessionStart,
                    endTime: windowClose,
                },
                create: {
                    name: config.name,
                    date: startOfDay(date),
                    startTime: sessionStart,
                    endTime: windowClose,
                    type: "AUTOMATIC",
                }
            });
        }
    }

    return null;
}

export function getCurrentSessionName(date: Date = new Date()): string {
    if (isSunday(date)) return "Sunday Service";
    if (isWednesday(date)) return "Mid-week Service";
    if (isFriday(date)) return "Friday Service";
    return "Special Event";
}

export function getSessionDateRange(date: Date = new Date()) {
    return {
        start: startOfDay(date),
        end: endOfDay(date),
    };
}
