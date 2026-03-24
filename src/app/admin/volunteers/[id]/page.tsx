import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Edit } from "lucide-react";
import { TeamManager } from "@/components/volunteers/TeamManager";

export default async function TeamDetailsPage({ params }: { params: { id: string } }) {
    const team = await prisma.team.findUnique({
        where: { id: params.id },
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
            }
        }
    });

    if (!team) return <div>Team not found</div>;

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

            <TeamManager 
                teamId={team.id}
                currentMembers={team.members}
                allMembers={allMembers}
                roles={team.roles}
            />
        </div>
    );
}
