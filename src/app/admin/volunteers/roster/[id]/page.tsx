import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { RosterEditor } from "@/components/volunteers/RosterEditor";

export default async function ServiceRosterEditorPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await prisma.serviceSession.findUnique({
        where: { id },
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
            },
            serviceTeams: {
                select: { teamId: true }
            }
        }
    });

    if (!session) return <div>Session not found</div>;

    const linkedTeamIds = session.serviceTeams.map(st => st.teamId);

    // Fetch all active team members grouped by their teams, to select from
    const teams = await prisma.team.findMany({
        include: {
            roles: {
                include: { team: true }
            },
            members: {
                include: { member: true }
            }
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/volunteers/roster"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-background text-muted-foreground transition-colors hover:bg-muted"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Edit Roster: {session.name}</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {session.date.toLocaleDateString()} at {session.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
            </div>

            <RosterEditor 
                sessionId={session.id}
                sessionName={session.name}
                sessionDate={session.date.toLocaleDateString()}
                scheduleId={session.schedule?.id}
                assignments={session.schedule?.assignments || []}
                teams={teams}
                linkedTeamIds={linkedTeamIds}
            />
        </div>
    );
}
