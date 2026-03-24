import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Users, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function MinistriesPage() {
    const groups = await prisma.ministryGroup.findMany({
        include: {
            _count: {
                select: { members: true }
            },
            members: {
                where: { role: "LEADER" },
                include: { member: true }
            }
        },
        orderBy: { name: "asc" }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Ministries & Small Groups</h1>
                    <p className="text-muted-foreground mt-2">Manage cell groups, ministries, and community structures.</p>
                </div>
                <Link href="/admin/ministries/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Group
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {groups.map((group) => (
                    <Link key={group.id} href={`/admin/ministries/${group.id}`}>
                        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 hover:shadow-md transition-shadow h-full flex flex-col cursor-pointer">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-semibold text-lg">{group.name}</h3>
                                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                                        {group.type}
                                    </span>
                                </div>
                            </div>
                            
                            {group.description && (
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                    {group.description}
                                </p>
                            )}

                            <div className="mt-auto space-y-3 pt-4 border-t">
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Users className="mr-2 h-4 w-4" />
                                    {group._count.members} Members
                                </div>
                                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                                    <Shield className="mr-2 h-4 w-4 shrink-0" />
                                    {group.members.length > 0 ? (
                                        <div className="flex flex-wrap gap-1">
                                            {group.members.map(l => (
                                                <span key={l.id} className="text-xs bg-secondary/20 px-2 py-1 rounded">
                                                    {l.member.firstName} {l.member.lastName}
                                                </span>
                                            ))}
                                        </div>
                                    ) : "No leaders assigned"}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}

                {groups.length === 0 && (
                    <div className="col-span-full border-2 border-dashed rounded-xl p-12 text-center text-muted-foreground">
                        <Users className="mx-auto h-12 w-12 opacity-50 mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">No Groups Found</h3>
                        <p>Create your first ministry or cell group to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
