import { prisma } from "@/lib/prisma";
import { getActiveSession } from "@/lib/sessions";
import Link from "next/link";
import { Calendar, CheckCircle, Users, QrCode, Clock, Plus } from "lucide-react";

export default async function AttendanceDashboard() {
    const today = new Date();
    const activeSession = await getActiveSession(today);

    // Get attendance for today's session
    const todayAttendance = activeSession ? activeSession.headcount : 0;
    const sessionName = activeSession ? activeSession.name : "No Active Session";

    // Get recent attendance records
    const recentRecords = await prisma.attendance.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
            member: true,
        },
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
                    <p className="text-muted-foreground">
                        {today.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        href="/admin/attendance/manual"
                        className="inline-flex items-center justify-center rounded-md border bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-muted"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Manual Session
                    </Link>
                    <Link
                        href="/admin/attendance/history"
                        className="inline-flex items-center justify-center rounded-md border bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-muted"
                    >
                        <Clock className="mr-2 h-4 w-4" />
                        View History
                    </Link>
                    <Link
                        href="/admin/attendance/check-in"
                        className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                    >
                        <QrCode className="mr-2 h-4 w-4" />
                        Launch Kiosk Mode
                    </Link>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Today's Stats */}
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 relative overflow-hidden">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Headcount</h3>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">{todayAttendance}</div>
                    <p className="text-xs text-muted-foreground">Checked in for {sessionName}</p>
                    <div className="absolute right-0 top-0 h-full w-2 bg-primary/20" />
                </div>

                {/* Session Info */}
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Current Session</h3>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold truncate">{sessionName}</div>
                    <p className="text-xs text-muted-foreground">Auto-detected</p>
                </div>


            </div>

            {/* Recent Activity */}
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                <div className="p-6 border-b">
                    <h3 className="font-semibold">Recent Check-ins</h3>
                </div>
                <div className="divide-y">
                    {recentRecords.length === 0 ? (
                        <div className="p-6 text-center text-muted-foreground text-sm">No recent check-ins today.</div>
                    ) : (
                        recentRecords.map((record: any) => (
                            <div key={record.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                        {record.member.firstName[0]}{record.member.lastName[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{record.member.firstName} {record.member.lastName}</p>
                                        <p className="text-xs text-muted-foreground">{record.serviceId || "Unknown Service"}</p>
                                    </div>
                                </div>
                                <div className="text-xs text-muted-foreground flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                    {record.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
