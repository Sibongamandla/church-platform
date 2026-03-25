import { startOfDay, endOfDay, isSunday, isWednesday, isFriday, addMinutes, subMinutes, isAfter, isBefore, addDays } from "date-fns";
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

// Helper to get SAST (+02:00) date regardless of server timezone
function getSASTDate(date: Date = new Date()): Date {
    // SAST is UTC+2
    const SAST_OFFSET = 120; // minutes
    const serverOffset = date.getTimezoneOffset();
    // Normalize to SAST by adding the difference
    return new Date(date.getTime() + (serverOffset + SAST_OFFSET) * 60000);
}

// Convert date to a stable UTC object at noon to avoid date-shifting for @db.Date fields
function toPrismaDate(date: Date): Date {
    const d = new Date(date);
    d.setUTCHours(12, 0, 0, 0);
    return d;
}

export async function getActiveSession(dateInput: Date = new Date()) {
    const date = getSASTDate(dateInput);
    const day = date.getDay();

    // 1. Check for manual sessions first (these use exact DateTime match)
    const manualSession = await prisma.serviceSession.findFirst({
        where: {
            type: "MANUAL",
            startTime: { lte: dateInput },
            endTime: { gte: dateInput },
        },
    });

    if (manualSession) return manualSession;

    // 2. Check for automatic sessions
    const config = AUTOMATIC_SESSIONS.find(s => s.day === day);
    if (config) {
        const [hours, minutes] = config.startTime.split(':').map(Number);
        
        // Target session time in SAST
        const sessionStart = new Date(date);
        sessionStart.setHours(hours, minutes, 0, 0);

        const windowOpen = subMinutes(sessionStart, 30);
        const windowClose = addMinutes(sessionStart, 240); // 4 hour window

        if (isAfter(date, windowOpen) && isBefore(date, windowClose)) {
            const dbDate = toPrismaDate(date);
            
            // Find or create the automatic session record for today
            return await prisma.serviceSession.upsert({
                where: {
                    name_date: {
                        name: config.name,
                        date: dbDate,
                    }
                },
                update: {
                    startTime: dateInput, // Keep current server time for tracking but... 
                    // actually better to store planned start time
                    endTime: addMinutes(sessionStart, 240),
                },
                create: {
                    name: config.name,
                    date: dbDate,
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

export async function syncUpcomingSessions(days: number = 14) {
    const today = startOfDay(new Date());
    const sessionsSynced = [];

    for (let i = 0; i < days; i++) {
        const currentDate = addDays(today, i);
        const dayOfWeek = currentDate.getDay();

        const config = AUTOMATIC_SESSIONS.find(s => s.day === dayOfWeek);
        if (config) {
            const [hours, minutes] = config.startTime.split(':').map(Number);
            const startTime = new Date(currentDate);
            startTime.setHours(hours, minutes, 0, 0);
            
            const endTime = new Date(startTime);
            endTime.setHours(startTime.getHours() + 4);

            await prisma.serviceSession.upsert({
                where: {
                    name_date: {
                        name: config.name,
                        date: currentDate,
                    }
                },
                update: {},
                create: {
                    name: config.name,
                    date: currentDate,
                    startTime,
                    endTime,
                    type: "AUTOMATIC",
                    schedule: {
                        create: {}
                    }
                }
            });
            sessionsSynced.push(`${config.name} on ${currentDate.toLocaleDateString()}`);
        }
    }
    return sessionsSynced;
}
