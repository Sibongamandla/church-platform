import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Users, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function VolunteersPage() {
    const teams = await prisma.team.findMany({
        include: {
            _count: {
                select: { members: true, roles: true }
            }
        },
        orderBy: { name: "asc" }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Volunteer Teams</h1>
                    <p className="text-muted-foreground mt-2">Manage service teams and rostering.</p>
                </div>
                <Link href="/admin/volunteers/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Team
                    </Button>
                </Link>
            </div>

            <div className="flex border-b border-border/40 gap-6">
                <Link href="/admin/volunteers" className="pb-2 border-b-2 border-primary font-medium">Teams</Link>
                <Link href="/admin/volunteers/roster" className="pb-2 text-muted-foreground hover:text-foreground transition-colors">Service Rosters</Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {teams.map((team) => (
                    <Link key={team.id} href={`/admin/volunteers/${team.id}`}>
                        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 hover:shadow-md transition-shadow h-full flex flex-col cursor-pointer">
                            <div className="mb-4">
                                <h3 className="font-semibold text-lg">{team.name}</h3>
                            </div>
                            
                            {team.description && (
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                    {team.description}
                                </p>
                            )}

                            <div className="mt-auto space-y-3 pt-4 border-t flex items-center justify-between text-sm text-muted-foreground">
                                <div className="flex items-center">
                                    <Users className="mr-2 h-4 w-4" />
                                    {team._count.members} Members
                                </div>
                                <div className="flex items-center">
                                    <Shield className="mr-2 h-4 w-4" />
                                    {team._count.roles} Roles
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}

                {teams.length === 0 && (
                    <div className="col-span-full border-2 border-dashed rounded-xl p-12 text-center text-muted-foreground">
                        <Users className="mx-auto h-12 w-12 opacity-50 mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">No Teams Found</h3>
                        <p>Create your first serving team (e.g., Worship, Ushers) to start scheduling.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
