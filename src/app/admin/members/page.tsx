import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Search, Filter, MoreHorizontal, Mail, Phone, MapPin, Upload } from "lucide-react";
// import { deleteMemberAction } from "@/app/actions/members"; // Will use in row actions

export default async function MembersPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; status?: string }>;
}) {
    const { q, status } = await searchParams;
    const query = q || "";
    const statusFilter = status || undefined;

    const where: any = {};

    if (query) {
        where.OR = [
            { firstName: { contains: query } },
            { lastName: { contains: query } },
            { email: { contains: query } },
        ];
    }

    if (statusFilter) {
        where.status = statusFilter;
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const members = await prisma.member.findMany({
        where,
        orderBy: { lastName: "asc" },
        include: {
            _count: {
                select: { attendance: true }
            },
            attendance: {
                where: {
                    date: {
                        gte: todayStart,
                        lt: todayEnd
                    }
                },
                select: { id: true }
            }
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Members</h1>
                <div className="flex items-center gap-2">
                    <Link
                        href="/admin/members/import"
                        className="inline-flex items-center justify-center rounded-md border bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-muted"
                    >
                        <Upload className="mr-2 h-4 w-4" />
                        Import CSV
                    </Link>
                    <Link
                        href="/admin/members/new"
                        className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Member
                    </Link>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex items-center gap-4 bg-card p-4 rounded-lg border shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <form>
                        <input
                            name="q"
                            defaultValue={query}
                            type="search"
                            placeholder="Search members..."
                            className="w-full rounded-md border border-input bg-background pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                        />
                    </form>
                </div>
                <div className="flex items-center gap-2">
                    {/* Simple Status Filter Links for now */}
                    <Link href="/admin/members" className={`text-sm font-medium ${!statusFilter ? "text-primary" : "text-muted-foreground"}`}>All</Link>
                    <span className="text-muted-foreground">|</span>
                    <Link href="/admin/members?status=ACTIVE" className={`text-sm font-medium ${statusFilter === "ACTIVE" ? "text-primary" : "text-muted-foreground"}`}>Active</Link>
                    <span className="text-muted-foreground">|</span>
                    <Link href="/admin/members?status=INACTIVE" className={`text-sm font-medium ${statusFilter === "INACTIVE" ? "text-primary" : "text-muted-foreground"}`}>Inactive</Link>
                </div>
            </div>

            {/* Members List */}
            <div className="rounded-md border bg-card shadow-sm">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Name</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Contact</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Attendance</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Status</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {members.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-muted-foreground">
                                        No members found.
                                    </td>
                                </tr>
                            ) : (
                                members.map((member) => (
                                    <tr key={member.id} className="border-b transition-colors hover:bg-muted/50">
                                        <td className="p-4 align-middle font-medium">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                    {member.firstName[0]}{member.lastName[0]}
                                                </div>
                                                <div>
                                                    {member.lastName}, {member.firstName}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                                                {member.email && (
                                                    <div className="flex items-center gap-1">
                                                        <Mail className="h-3 w-3" /> {member.email}
                                                    </div>
                                                )}
                                                {member.phone && (
                                                    <div className="flex items-center gap-1">
                                                        <Phone className="h-3 w-3" /> {member.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-medium">{member._count.attendance} Check-ins</span>
                                                {member.attendance.length > 0 && (
                                                    <span className="inline-flex w-fit items-center rounded-full border border-green-200 bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-800">
                                                        <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-green-600 animate-pulse"></span>
                                                        Checked In
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${member.status === "ACTIVE"
                                                ? "border-transparent bg-green-500/15 text-green-700 dark:text-green-400"
                                                : "border-transparent bg-secondary text-secondary-foreground"
                                                }`}>
                                                {member.status}
                                            </span>
                                        </td>
                                        <td className="p-4 align-middle text-right">
                                            <Link href={`/admin/members/${member.id}`} className="text-primary hover:underline text-sm font-medium">View</Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
