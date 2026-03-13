import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay, subDays } from "date-fns";
import { getCurrentSessionName } from "@/lib/sessions";

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.NODE_ENV === 'production') {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        // Archive sessions from the last 7 days
        const targetDates = Array.from({ length: 7 }, (_, i) => subDays(new Date(), i));

        const results = [];

        for (const date of targetDates) {
            const dayStart = startOfDay(date);
            const dayEnd = endOfDay(date);
            const sessionName = getCurrentSessionName(date);

            // Count attendance for this day and session
            const count = await prisma.attendance.count({
                where: {
                    date: {
                        gte: dayStart,
                        lte: dayEnd,
                    },
                    serviceId: sessionName
                }
            });

            if (count > 0) {
                // Aggregate into ServiceSession
                const session = await prisma.serviceSession.upsert({
                    where: {
                        name_date: {
                            name: sessionName,
                            date: dayStart
                        }
                    },
                    update: {
                        headcount: count,
                        isArchived: true
                    },
                    create: {
                        name: sessionName,
                        date: dayStart,
                        headcount: count,
                        isArchived: true
                    }
                });
                results.push(session);
            }
        }

        return NextResponse.json({ success: true, archived: results.length, sessions: results });
    } catch (error) {
        console.error("Archiving error:", error);
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    }
}
