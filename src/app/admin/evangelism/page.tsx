import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, ExternalLink, QrCode } from "lucide-react";

export default async function EvangelismDashboard() {
    const profiles = await prisma.smartProfile.findMany({
        include: {
            member: true,
        },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Digital Evangelism</h1>
                    <p className="text-muted-foreground">Manage public smart profiles and QR codes.</p>
                </div>
                <Link
                    href="/admin/evangelism/new"
                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Profile
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {profiles.length === 0 ? (
                    <div className="col-span-full text-center py-12 bg-muted/20 rounded-xl border border-dashed">
                        <p className="text-muted-foreground">No smart profiles created yet.</p>
                        <Link href="/admin/evangelism/new" className="text-primary hover:underline mt-2 inline-block">
                            Get started by creating one
                        </Link>
                    </div>
                ) : (
                    profiles.map((profile) => (
                        <div key={profile.id} className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                    {profile.member.firstName[0]}{profile.member.lastName[0]}
                                </div>
                                <div>
                                    <h3 className="font-semibold">{profile.member.firstName} {profile.member.lastName}</h3>
                                    <p className="text-xs text-muted-foreground max-w-[150px] truncate">/{profile.slug}</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t flex items-center justify-between text-sm">
                                <Link
                                    href={`/e/${profile.slug}`}
                                    target="_blank"
                                    className="flex items-center text-primary hover:underline"
                                >
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    View Public Page
                                </Link>
                                {/* Future: QR Code download */}
                                <button className="flex items-center text-muted-foreground hover:text-foreground disabled:opacity-50" disabled>
                                    <QrCode className="mr-2 h-4 w-4" />
                                    QR Code
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
