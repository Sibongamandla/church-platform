import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, Calendar, Clock, CheckCircle } from "lucide-react";

export default async function SessionDetailsPage({ params }: { params: { id: string } }) {
    const session = await prisma.serviceSession.findUnique({
        where: { id: params.id },
        include: {
            attendance: {
                include: {
                    member: true
                },
                orderBy: {
                    createdAt: 'asc'
                }
            }
        }
    });

    if (!session) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/attendance/history" className="p-2 hover:bg-muted rounded-full transition-colors">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{session.name}</h1>
                    <p className="text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {session.date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-xl border bg-card p-6">
                    <div className="flex items-center justify-between pb-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Total Headcount</h3>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">{session.headcount}</div>
                    <p className="text-xs text-muted-foreground">Verified check-ins</p>
                </div>

                <div className="rounded-xl border bg-card p-6">
                    <div className="flex items-center justify-between pb-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Time Window</h3>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-sm font-medium">
                        {session.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                        {session.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <p className="text-xs text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis">Duration: {Math.round((session.endTime.getTime() - session.startTime.getTime()) / (1000 * 60))} minutes</p>
                </div>

                <div className="rounded-xl border bg-card p-6">
                    <div className="flex items-center justify-between pb-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Session Type</h3>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold capitalize">{session.type.toLowerCase()}</div>
                    <p className="text-xs text-muted-foreground">Creation method</p>
                </div>
            </div>

            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="p-6 border-b bg-muted/30">
                    <h3 className="font-semibold flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        Check-in List
                    </h3>
                </div>
                <div className="divide-y max-h-[600px] overflow-y-auto">
                    {session.attendance.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground italic">
                            No individual check-in records found for this session.
                        </div>
                    ) : (
                        session.attendance.map((record: any) => (
                            <div key={record.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        {record.member.firstName[0]}{record.member.lastName[0]}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{record.member.firstName} {record.member.lastName}</p>
                                        <p className="text-xs text-muted-foreground">{record.member.phone || "No phone"}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-semibold tabular-nums">
                                        {record.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    </div>
                                    <p className="text-[10px] text-muted-foreground">Original Timestamp</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
