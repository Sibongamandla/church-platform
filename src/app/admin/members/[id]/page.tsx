import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, User, Edit } from "lucide-react";

export default async function MemberProfilePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const member = await prisma.member.findUnique({
        where: { id },
        include: {
            family: {
                include: { members: true }
            },
            user: true,
            _count: {
                select: { attendance: true }
            }
        },
    });

    if (!member) {
        notFound();
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/members"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-background text-muted-foreground transition-colors hover:bg-muted"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            {member.firstName} {member.lastName}
                        </h1>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${member.status === "ACTIVE"
                                ? "border-transparent bg-green-500/15 text-green-700"
                                : "border-transparent bg-secondary text-secondary-foreground"
                                }`}>
                                {member.status}
                            </span>
                            <span>•</span>
                            <span>Member since {member.createdAt.toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
                <Link
                    href={`/admin/members/${member.id}/edit`}
                    className="inline-flex items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-sm transition-colors hover:bg-secondary/80"
                >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Main Info */}
                <div className="md:col-span-2 space-y-6">
                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <User className="h-4 w-4 text-primary" />
                            Personal Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                                <dd className="text-sm flex items-center gap-2 mt-1">
                                    {member.email ? (
                                        <>
                                            <Mail className="h-3 w-3 text-muted-foreground" />
                                            {member.email}
                                        </>
                                    ) : "—"}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
                                <dd className="text-sm flex items-center gap-2 mt-1">
                                    {member.phone ? (
                                        <>
                                            <Phone className="h-3 w-3 text-muted-foreground" />
                                            {member.phone}
                                        </>
                                    ) : "—"}
                                </dd>
                            </div>
                            <div className="sm:col-span-2">
                                <dt className="text-sm font-medium text-muted-foreground">Address</dt>
                                <dd className="text-sm flex items-center gap-2 mt-1">
                                    {member.address ? (
                                        <>
                                            <MapPin className="h-3 w-3 text-muted-foreground" />
                                            {member.address}
                                        </>
                                    ) : "—"}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Birthday</dt>
                                <dd className="text-sm flex items-center gap-2 mt-1">
                                    {member.birthday ? (
                                        <>
                                            <Calendar className="h-3 w-3 text-muted-foreground" />
                                            {member.birthday.toLocaleDateString()}
                                        </>
                                    ) : "—"}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Gender</dt>
                                <dd className="text-sm mt-1 capitalize">{member.gender || "—"}</dd>
                            </div>
                        </div>
                    </div>

                    {/* Family Section */}
                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                        <h3 className="font-semibold mb-4">Family</h3>
                        {member.family ? (
                            <div className="space-y-4">
                                <p className="font-medium">{member.family.name}</p>
                                <div className="flex flex-wrap gap-2">
                                    {member.family.members.map(famMember => (
                                        <Link
                                            key={famMember.id}
                                            href={`/admin/members/${famMember.id}`}
                                            className={`px-3 py-1 rounded-full text-sm border ${famMember.id === member.id ? "bg-primary/10 border-primary/20 text-primary" : "bg-muted border-transparent hover:bg-muted/80"}`}
                                        >
                                            {famMember.firstName}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-sm text-muted-foreground">
                                No family linked. <button className="text-primary hover:underline">Create or link family</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar / Stats */}
                <div className="space-y-6">
                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                        <h3 className="font-semibold mb-4">Attendance Stats</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="text-2xl font-bold">0%</div>
                                <div className="text-xs text-muted-foreground">Last 4 weeks</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{member._count.attendance}</div>
                                <div className="text-xs text-muted-foreground">Total Check-ins</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
