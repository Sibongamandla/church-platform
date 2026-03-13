import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { UserCheck, Calendar, Phone, Mail, Clock } from "lucide-react";

export default async function VisitorsAdminPage() {
    // "Visitors" = recently created members (last 60 days), not linked to a user account
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const visitors = await prisma.member.findMany({
        where: {
            createdAt: { gte: sixtyDaysAgo },
            userId: null, // Registered via kiosk, not a full user account
        },
        orderBy: { createdAt: "desc" },
        include: {
            _count: { select: { attendance: true } },
        },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Visitors</h1>
                    <p className="text-sm text-muted-foreground mt-1">New profiles created via the kiosk in the last 60 days.</p>
                </div>
            </div>

            <div className="rounded-md border bg-card shadow-sm overflow-hidden">
                {visitors.length === 0 ? (
                    <div className="text-center py-16">
                        <UserCheck className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                        <h3 className="text-sm font-semibold text-foreground">No visitors yet</h3>
                        <p className="text-sm text-muted-foreground mt-1">Visitors who check in via the kiosk will appear here.</p>
                    </div>
                ) : (
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 border-b">
                            <tr>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Name</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Contact</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Visits</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Registered</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visitors.map((visitor) => (
                                <tr key={visitor.id} className="border-b hover:bg-muted/30 transition-colors">
                                    <td className="p-4 align-middle font-medium">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                {visitor.firstName[0]}{visitor.lastName[0]}
                                            </div>
                                            {visitor.firstName} {visitor.lastName}
                                        </div>
                                    </td>
                                    <td className="p-4 align-middle">
                                        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                                            {visitor.email && (
                                                <div className="flex items-center gap-1"><Mail className="h-3 w-3" />{visitor.email}</div>
                                            )}
                                            {visitor.phone && (
                                                <div className="flex items-center gap-1"><Phone className="h-3 w-3" />{visitor.phone}</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 align-middle">
                                        <span className="font-semibold">{visitor._count.attendance}</span>
                                        <span className="text-muted-foreground text-xs ml-1">check-ins</span>
                                    </td>
                                    <td className="p-4 align-middle text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {visitor.createdAt.toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="p-4 align-middle text-right">
                                        <Link
                                            href={`/admin/members/${visitor.id}`}
                                            className="text-primary hover:underline text-sm font-medium"
                                        >
                                            View Profile
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
