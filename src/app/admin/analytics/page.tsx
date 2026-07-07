import { prisma } from "@/lib/prisma";
import { format, subMonths, startOfMonth } from "date-fns";
import { AnalyticsCharts } from "./AnalyticsCharts";
import { AuditPrintTable } from "./AuditPrintTable";
import { Users, ClipboardCheck, Link2, ShieldCheck } from "lucide-react";

export const metadata = { title: "Analytics" };

export default async function AnalyticsPage() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);
    const sixMonthsAgo = startOfMonth(subMonths(now, 5));

    const [
        totalMembers,
        totalSessions,
        totalLinkClicks,
        auditCount30d,
        rawMemberGrowth,
        recentSessions,
        shortLinks,
        auditByAction,
        auditEntries,
    ] = await Promise.all([
        prisma.member.count({ where: { status: "ACTIVE" } }),
        prisma.serviceSession.count(),
        prisma.shortLink.aggregate({ _sum: { clicks: true } }),
        prisma.auditLog.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),

        // Member growth: raw records so we can group by month in JS
        prisma.member.findMany({
            where: { createdAt: { gte: sixMonthsAgo } },
            select: { createdAt: true },
            orderBy: { createdAt: "asc" },
        }),

        // Last 12 service sessions
        prisma.serviceSession.findMany({
            take: 12,
            orderBy: { date: "desc" },
            select: { name: true, date: true, headcount: true },
        }),

        // Short links ranked by clicks
        prisma.shortLink.findMany({
            orderBy: { clicks: "desc" },
            select: { slug: true, clicks: true },
        }),

        // Audit actions grouped by type (last 30 days)
        prisma.auditLog.groupBy({
            by: ["action"],
            where: { createdAt: { gte: thirtyDaysAgo } },
            _count: { action: true },
            orderBy: { _count: { action: "desc" } },
        }),

        // Full audit log for print
        prisma.auditLog.findMany({
            orderBy: { createdAt: "desc" },
            take: 1000,
            select: { id: true, action: true, resource: true, details: true, ipAddress: true, createdAt: true },
        }),
    ]);

    // Group member growth by month label
    const growthMap = new Map<string, number>();
    for (let i = 5; i >= 0; i--) {
        const label = format(subMonths(now, i), "MMM yy");
        growthMap.set(label, 0);
    }
    for (const { createdAt } of rawMemberGrowth) {
        const label = format(createdAt, "MMM yy");
        if (growthMap.has(label)) growthMap.set(label, (growthMap.get(label) ?? 0) + 1);
    }
    const memberGrowth = Array.from(growthMap.entries()).map(([month, count]) => ({ month, count }));

    // Attendance: reverse so oldest is left
    const attendance = recentSessions
        .reverse()
        .map((s) => ({ name: `${s.name} ${format(s.date, "d MMM")}`, headcount: s.headcount }));

    const linkClicks = shortLinks.map((l) => ({ slug: l.slug, clicks: l.clicks }));

    const auditActions = auditByAction.map((a) => ({ action: a.action, count: a._count.action }));

    // Serialise dates for client components
    const serialisedAudit = auditEntries.map((e) => ({
        ...e,
        createdAt: e.createdAt.toISOString(),
    }));

    const summaryStats = [
        { label: "Active Members", value: totalMembers, icon: Users, color: "text-blue-600 bg-blue-100" },
        { label: "Service Sessions", value: totalSessions, icon: ClipboardCheck, color: "text-green-600 bg-green-100" },
        { label: "Total Link Clicks", value: totalLinkClicks._sum.clicks ?? 0, icon: Link2, color: "text-purple-600 bg-purple-100" },
        { label: "Audit Events (30d)", value: auditCount30d, icon: ShieldCheck, color: "text-amber-600 bg-amber-100" },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                    <p className="text-muted-foreground mt-1">Church activity and platform usage insights</p>
                </div>
            </div>

            {/* Summary stat cards */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 no-print">
                {summaryStats.map((stat) => (
                    <div key={stat.label} className="rounded-xl border bg-card shadow-sm p-5">
                        <div className="flex items-center justify-between pb-2">
                            <span className="text-xs font-medium text-muted-foreground">{stat.label}</span>
                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${stat.color}`}>
                                <stat.icon className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold">{stat.value}</div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <AnalyticsCharts
                memberGrowth={memberGrowth}
                attendance={attendance}
                linkClicks={linkClicks}
                auditActions={auditActions}
            />

            {/* Audit log + print button */}
            <AuditPrintTable entries={serialisedAudit} />
        </div>
    );
}
