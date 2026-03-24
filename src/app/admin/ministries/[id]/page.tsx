import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Users, Calendar } from "lucide-react";
import { RosterManager } from "@/components/ministries/RosterManager";

export default async function MinistryDetailsPage({ params }: { params: { id: string } }) {
    const group = await prisma.ministryGroup.findUnique({
        where: { id: params.id },
        include: {
            members: {
                include: { member: true },
                orderBy: [
                    { role: "desc" }, // LEADER first
                    { member: { firstName: "asc" } }
                ]
            },
            sessions: {
                orderBy: { date: "desc" },
                take: 5,
                include: {
                    _count: { select: { attendances: true } }
                }
            }
        }
    });

    if (!group) return <div>Group not found</div>;

    // Get all active members in the whole church for the dropdown
    const allMembers = await prisma.member.findMany({
        where: { status: "ACTIVE" },
        select: { id: true, firstName: true, lastName: true, email: true },
        orderBy: { firstName: "asc" }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/ministries"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-background text-muted-foreground transition-colors hover:bg-muted"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{group.name}</h1>
                        <p className="text-sm text-muted-foreground mt-1 capitalize">{group.type.toLowerCase()}</p>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Users className="h-5 w-5 text-primary" />
                            <h2 className="text-lg font-semibold">Group Members & Leaders</h2>
                        </div>
                        <RosterManager 
                            groupId={group.id} 
                            currentMembers={group.members} 
                            allMembers={allMembers} 
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-primary" />
                                <h2 className="text-lg font-semibold">Recent Meetings</h2>
                            </div>
                        </div>
                        
                        {group.sessions.length === 0 ? (
                            <p className="text-sm text-muted-foreground italic">No meetings recorded yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {group.sessions.map(s => (
                                    <div key={s.id} className="flex justify-between items-center pb-2 border-b last:border-0">
                                        <div>
                                            <p className="font-medium text-sm">{s.date.toLocaleDateString()}</p>
                                            <p className="text-xs text-muted-foreground">{s.topic || 'No topic'}</p>
                                        </div>
                                        <div className="text-sm font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                                            {s._count.attendances} / {group.members.length}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-4 text-center">
                            Note: Full attendance tracking UI pending.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
