import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Clock, TrendingUp, Users } from "lucide-react";

export default async function AttendanceHistoryPage() {
    const sessions = await prisma.serviceSession.findMany({
        orderBy: { date: "desc" },
        take: 50
    });

    // Calculate growth if possible
    let growth = 0;
    if (sessions.length >= 2) {
        const current = sessions[0].headcount;
        const previous = sessions[1].headcount;
        if (previous > 0) {
            growth = ((current - previous) / previous) * 100;
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/attendance" className="p-2 hover:bg-muted rounded-full transition-colors">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Attendance History</h1>
                    <p className="text-muted-foreground">Historical records of past sessions and headcount.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border bg-card p-6">
                    <div className="flex items-center justify-between pb-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Average Attendance</h3>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">
                        {sessions.length > 0 
                            ? Math.round(sessions.reduce((acc: number, s: any) => acc + s.headcount, 0) / sessions.length)
                            : 0}
                    </div>
                    <p className="text-xs text-muted-foreground">Last {sessions.length} sessions</p>
                </div>

                <div className="rounded-xl border bg-card p-6">
                    <div className="flex items-center justify-between pb-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Recent Growth</h3>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className={cn("text-2xl font-bold", growth >= 0 ? "text-green-600" : "text-destructive")}>
                        {growth > 0 ? "+" : ""}{growth.toFixed(1)}%
                    </div>
                    <p className="text-xs text-muted-foreground">Vs previous session</p>
                </div>
            </div>

            <div className="rounded-xl border bg-card overflow-hidden text-card-foreground shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 border-b">
                        <tr>
                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Session Name</th>
                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Date</th>
                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Headcount</th>
                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sessions.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-muted-foreground italic">
                                    No archived sessions found. The first archive will be generated automatically.
                                </td>
                            </tr>
                        ) : (
                            sessions.map((session: any) => (
                                <tr key={session.id} className="border-b hover:bg-muted/50 transition-colors group">
                                    <td className="p-4 align-middle">
                                        <Link 
                                            href={`/admin/attendance/history/${session.id}`}
                                            className="block hover:underline"
                                        >
                                            <div className="font-semibold text-primary group-hover:underline">{session.name}</div>
                                            <div className="text-[10px] text-muted-foreground uppercase">
                                                {session.type}
                                            </div>
                                        </Link>
                                    </td>
                                    <td className="p-4 align-middle">
                                        <Link href={`/admin/attendance/history/${session.id}`} className="block">
                                            <div className="text-sm">
                                                {session.date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {session.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                                                {session.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </Link>
                                    </td>
                                    <td className="p-4 align-middle">
                                        <Link href={`/admin/attendance/history/${session.id}`} className="block">
                                            <div className="font-bold text-lg">{session.headcount}</div>
                                        </Link>
                                    </td>
                                    <td className="p-4 align-middle text-right text-xs">
                                        <Link href={`/admin/attendance/history/${session.id}`} className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 font-medium text-green-800 hover:bg-green-200 transition-colors">
                                            View Details
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(" ");
}
