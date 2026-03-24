import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Edit, Users, CalendarDays } from "lucide-react";
import { TeamManager } from "@/components/volunteers/TeamManager";
import { TeamSessionLinker } from "@/components/volunteers/TeamSessionLinker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function TeamDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const team = await prisma.team.findUnique({
        where: { id },
        include: {
            roles: {
                orderBy: { name: "asc" }
            },
            members: {
                include: { 
                    member: true,
                    role: true
                },
                orderBy: { member: { firstName: "asc" } }
            },
            serviceTeams: {
                select: { sessionId: true }
            }
        }
    });

    if (!team) return <div>Team not found</div>;

    const upcomingSessions = await prisma.serviceSession.findMany({
        where: { date: { gte: new Date() } },
        orderBy: { date: "asc" },
        take: 10
    });

    const linkedSessionIds = team.serviceTeams.map(st => st.sessionId);

    const allMembers = await prisma.member.findMany({
        where: { status: "ACTIVE" },
        select: { id: true, firstName: true, lastName: true, email: true },
        orderBy: { firstName: "asc" }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/volunteers"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-background text-muted-foreground transition-colors hover:bg-muted"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{team.name}</h1>
                    {team.description && (
                        <p className="text-sm text-muted-foreground mt-1">{team.description}</p>
                    )}
                </div>
            </div>

            <Tabs defaultValue="members" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                    <TabsTrigger value="members">
                        <Users className="h-4 w-4 mr-2" />
                        Team & Roles
                    </TabsTrigger>
                    <TabsTrigger value="sessions">
                        <CalendarDays className="h-4 w-4 mr-2" />
                        Serving Sessions
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="members" className="mt-6">
                    <TeamManager 
                        teamId={team.id}
                        currentMembers={team.members}
                        allMembers={allMembers}
                        roles={team.roles}
                    />
                </TabsContent>

                <TabsContent value="sessions" className="mt-6">
                    <TeamSessionLinker 
                        teamId={team.id}
                        upcomingSessions={upcomingSessions}
                        linkedSessionIds={linkedSessionIds}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
