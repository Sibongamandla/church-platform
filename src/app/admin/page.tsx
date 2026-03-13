import { prisma } from "@/lib/prisma";
import { Users, Calendar, Play, ClipboardCheck } from "lucide-react";

export default async function AdminDashboard() {
    const today = new Date();
    const todayStart = new Date(today.setHours(0, 0, 0, 0));
    const todayEnd = new Date(today.setHours(23, 59, 59, 999));
    const now = new Date();

    const [totalMembers, todayCheckIns, upcomingEvents, totalSermons] = await Promise.all([
        prisma.member.count({ where: { status: "ACTIVE" } }),
        prisma.attendance.count({ where: { date: { gte: todayStart, lte: todayEnd } } }),
        prisma.event.count({ where: { startDate: { gte: now } } }),
        prisma.sermon.count(),
    ]);

    const stats = [
        { label: "Total Members", value: totalMembers, sub: "Active members", icon: Users, color: "text-blue-600 bg-blue-100" },
        { label: "Today's Check-ins", value: todayCheckIns, sub: "This service", icon: ClipboardCheck, color: "text-green-600 bg-green-100" },
        { label: "Upcoming Events", value: upcomingEvents, sub: "Scheduled ahead", icon: Calendar, color: "text-orange-600 bg-orange-100" },
        { label: "Sermons Published", value: totalSermons, sub: "In the archive", icon: Play, color: "text-purple-600 bg-purple-100" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">{stat.label}</h3>
                            <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${stat.color}`}>
                                <stat.icon className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
                    </div>
                ))}
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                <div className="p-6 flex flex-row items-center justify-between border-b">
                    <h3 className="tracking-tight text-lg font-medium">Quick Actions</h3>
                </div>
                <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "Add Member", href: "/admin/members/new" },
                        { label: "Create Event", href: "/admin/events/new" },
                        { label: "Add Sermon", href: "/admin/sermons/new" },
                        { label: "Announcement", href: "/admin/announcements/new" },
                    ].map((action) => (
                        <a
                            key={action.label}
                            href={action.href}
                            className="flex items-center justify-center p-4 rounded-lg border bg-muted/30 hover:bg-muted/60 text-sm font-medium transition-colors text-center"
                        >
                            {action.label}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
