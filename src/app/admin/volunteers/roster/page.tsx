import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Calendar, CheckCircle, Clock, XCircle, Plus, RefreshCw } from "lucide-react";
import { SyncSessionsButton } from "@/components/volunteers/SyncSessionsButton";
import { syncUpcomingSessions } from "@/lib/sessions";

export default async function RostersPage() {
    // Proactively sync upcoming sessions for the next 2 weeks
    await syncUpcomingSessions(14);

    // Fetch upcoming services
    const upcomingSessions = await prisma.serviceSession.findMany({
        where: {
            date: { gte: new Date() }
        },
        orderBy: { date: "asc" },
        take: 10,
        include: {
            schedule: {
                include: {
                    assignments: {
                        include: {
                            member: true,
                            role: { include: { team: true } }
                        }
                    }
                }
            }
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Service Rosters</h1>
                    <p className="text-muted-foreground mt-1">Manage upcoming volunteer assignments.</p>
                </div>
                <div className="flex items-center gap-2">
                    <SyncSessionsButton />
                    <Link
                        href="/admin/attendance/manual"
                        className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Special Session
                    </Link>
                </div>
            </div>

            <div className="flex border-b border-border/40 gap-6">
                <Link href="/admin/volunteers" className="pb-2 text-muted-foreground hover:text-foreground transition-colors">Teams</Link>
                <Link href="/admin/volunteers/roster" className="pb-2 border-b-2 border-primary font-medium">Service Rosters</Link>
            </div>

            <div className="space-y-6">
                {upcomingSessions.length === 0 ? (
                    <div className="border-2 border-dashed rounded-xl p-12 text-center text-muted-foreground">
                        <Calendar className="mx-auto h-12 w-12 opacity-50 mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">No Upcoming Services</h3>
                        <p>There are no services scheduled in the near future.</p>
                    </div>
                ) : upcomingSessions.map(session => (
                    <div key={session.id} className="rounded-xl border bg-card p-6 space-y-4">
                        <div className="flex justify-between items-center border-b pb-4">
                            <div>
                                <h3 className="text-xl font-bold">{session.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {session.date.toLocaleDateString()} at {session.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                            {/* Link would go to a detailed roster editor page for this session */}
                            <Link href={`/admin/volunteers/roster/${session.id}`} className="text-sm text-primary font-medium hover:underline">
                                Edit Roster &rarr;
                            </Link>
                        </div>
                        
                        {!session.schedule || session.schedule.assignments.length === 0 ? (
                            <p className="text-sm text-muted-foreground py-2 italic text-center">No volunteers scheduled for this service yet.</p>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {session.schedule.assignments.map(a => (
                                    <div key={a.id} className="flex flex-col gap-2 p-3 border rounded-lg bg-muted/30">
                                        <div className="flex justify-between items-start">
                                            <span className="font-semibold">{a.member.firstName} {a.member.lastName}</span>
                                            {a.status === "CONFIRMED" && <CheckCircle className="h-4 w-4 text-green-500" />}
                                            {a.status === "PENDING" && <Clock className="h-4 w-4 text-yellow-500" />}
                                            {a.status === "DECLINED" && <XCircle className="h-4 w-4 text-red-500" />}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {a.role.team.name} • {a.role.name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
