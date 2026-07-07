import { prisma } from "@/lib/prisma";
import { format, subMonths, subDays, startOfMonth, differenceInDays } from "date-fns";
import { AnalyticsCharts } from "./AnalyticsCharts";
import { AuditPrintTable } from "./AuditPrintTable";
import { PlatformHealth } from "./PlatformHealth";
import { ActionableInsights } from "./ActionableInsights";
import { StoryCards } from "./StoryCards";
import type { Insight } from "./ActionableInsights";
import { Users, ClipboardCheck, Link2, ShieldCheck } from "lucide-react";

export const metadata = { title: "Analytics" };

export default async function AnalyticsPage() {
    const now = new Date();
    const thirtyDaysAgo = subDays(now, 30);
    const ninetyDaysAgo = subDays(now, 90);
    const sevenDaysAgo = subDays(now, 7);
    const fourteenDaysAgo = subDays(now, 14);
    const sixMonthsAgo = startOfMonth(subMonths(now, 5));
    const thisMonthStart = startOfMonth(now);

    const [
        // Summary cards
        totalMembers,
        totalSessions,
        totalLinkClicks,
        auditCount30d,

        // Health score inputs
        latestSermon,
        nextEvent,
        latestAnnouncement,
        pendingRosterCount,
        confirmedRosterThisWeek,
        newMembersThisMonth,

        // Admin story
        loginEvents30d,
        auditLogs30d,
        allUsers,
        auditByAction30d,

        // Member engagement
        attendanceRecords90d,
        topSessions,
        avgHeadcountResult,
        checkIns30d,

        // Content freshness
        eventsWithNoRecap,
        smartProfileCount,

        // Charts
        rawMemberGrowth,
        recentSessions,
        shortLinks,

        // Full audit for print
        fullAuditLog,
    ] = await Promise.all([
        prisma.member.count({ where: { status: "ACTIVE" } }),
        prisma.serviceSession.count(),
        prisma.shortLink.aggregate({ _sum: { clicks: true } }),
        prisma.auditLog.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),

        prisma.sermon.findFirst({ orderBy: { date: "desc" }, select: { date: true, title: true } }),
        prisma.event.findFirst({ where: { startDate: { gte: now } }, orderBy: { startDate: "asc" }, select: { startDate: true, title: true } }),
        prisma.announcement.findFirst({ orderBy: { date: "desc" }, select: { date: true, title: true } }),
        prisma.rosterAssignment.count({ where: { status: "PENDING" } }),
        prisma.rosterAssignment.count({ where: { status: "CONFIRMED" } }),
        prisma.member.count({ where: { createdAt: { gte: thisMonthStart } } }),

        prisma.auditLog.findMany({
            where: { action: "LOGIN", createdAt: { gte: thirtyDaysAgo } },
            select: { userId: true, createdAt: true },
        }),
        prisma.auditLog.findMany({
            where: { createdAt: { gte: thirtyDaysAgo } },
            select: { action: true, resource: true, userId: true, createdAt: true },
            orderBy: { createdAt: "desc" },
        }),
        prisma.user.findMany({ select: { id: true, name: true, email: true } }),
        prisma.auditLog.groupBy({
            by: ["action"],
            where: { createdAt: { gte: thirtyDaysAgo } },
            _count: { action: true },
            orderBy: { _count: { action: "desc" } },
        }),

        prisma.attendance.findMany({
            where: { createdAt: { gte: ninetyDaysAgo } },
            select: { date: true },
        }),
        prisma.serviceSession.findMany({
            orderBy: { headcount: "desc" },
            take: 5,
            select: { name: true, date: true, headcount: true },
        }),
        prisma.serviceSession.aggregate({ _avg: { headcount: true } }),
        prisma.attendance.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),

        prisma.event.count({ where: { startDate: { lt: now }, recapContent: null } }),
        prisma.smartProfile.count(),

        prisma.member.findMany({
            where: { createdAt: { gte: sixMonthsAgo } },
            select: { createdAt: true },
            orderBy: { createdAt: "asc" },
        }),
        prisma.serviceSession.findMany({
            take: 12,
            orderBy: { date: "desc" },
            select: { name: true, date: true, headcount: true },
        }),
        prisma.shortLink.findMany({ orderBy: { clicks: "desc" }, select: { slug: true, clicks: true } }),

        prisma.auditLog.findMany({
            orderBy: { createdAt: "desc" },
            take: 1000,
            select: { id: true, action: true, resource: true, details: true, ipAddress: true, createdAt: true, userId: true },
        }),
    ]);

    // ─── Health Score ───────────────────────────────────────────────────────────
    const daysSinceLastSermon = latestSermon ? differenceInDays(now, new Date(latestSermon.date)) : null;
    const daysSinceLastAnnouncement = latestAnnouncement ? differenceInDays(now, new Date(latestAnnouncement.date)) : null;
    const daysUntilNextEvent = nextEvent ? differenceInDays(new Date(nextEvent.startDate), now) : null;

    const sermonScore = daysSinceLastSermon === null ? 0 : daysSinceLastSermon <= 7 ? 20 : daysSinceLastSermon <= 14 ? 14 : daysSinceLastSermon <= 30 ? 7 : 0;
    const announcementScore = daysSinceLastAnnouncement === null ? 0 : daysSinceLastAnnouncement <= 7 ? 20 : daysSinceLastAnnouncement <= 14 ? 10 : 0;
    const eventScore = nextEvent ? 20 : 0;
    const volunteerScore = confirmedRosterThisWeek > 0 ? 20 : pendingRosterCount > 0 ? 10 : 0;
    const growthScore = Math.min(20, newMembersThisMonth * 4);
    const healthScore = sermonScore + announcementScore + eventScore + volunteerScore + growthScore;

    const healthBreakdown = [
        { label: "Sermon freshness", score: sermonScore, max: 20, note: daysSinceLastSermon === null ? "No sermons" : `${daysSinceLastSermon}d ago` },
        { label: "Announcements", score: announcementScore, max: 20, note: daysSinceLastAnnouncement === null ? "None posted" : `${daysSinceLastAnnouncement}d ago` },
        { label: "Upcoming events", score: eventScore, max: 20, note: nextEvent ? `In ${daysUntilNextEvent}d` : "No events scheduled" },
        { label: "Volunteer coverage", score: volunteerScore, max: 20, note: confirmedRosterThisWeek > 0 ? `${confirmedRosterThisWeek} confirmed` : pendingRosterCount > 0 ? `${pendingRosterCount} pending` : "None assigned" },
        { label: "Member growth", score: growthScore, max: 20, note: `${newMembersThisMonth} new this month` },
    ];

    // ─── Actionable Insights ────────────────────────────────────────────────────
    const insights: Insight[] = [];
    if (daysSinceLastSermon === null || daysSinceLastSermon > 14) {
        insights.push({ priority: "urgent", title: "Post a sermon", detail: daysSinceLastSermon === null ? "No sermons uploaded yet — share your messages with the congregation" : `Last sermon was ${daysSinceLastSermon} days ago. Weekly uploads keep members engaged`, href: "/admin/sermons/new", icon: "Video" });
    }
    if (!nextEvent) {
        insights.push({ priority: "urgent", title: "Create an upcoming event", detail: "No events are scheduled. Give members something to look forward to", href: "/admin/events/new", icon: "Calendar" });
    }
    if (daysSinceLastAnnouncement === null || daysSinceLastAnnouncement > 7) {
        insights.push({ priority: "recommended", title: "Post an announcement", detail: daysSinceLastAnnouncement === null ? "No announcements yet — keep the congregation informed" : `Last announcement was ${daysSinceLastAnnouncement} days ago`, href: "/admin/announcements/new", icon: "Megaphone" });
    }
    if (pendingRosterCount > 0) {
        insights.push({ priority: "recommended", title: "Confirm volunteer roster", detail: `${pendingRosterCount} volunteer assignment${pendingRosterCount === 1 ? "" : "s"} waiting for confirmation`, href: "/admin/volunteers/roster", icon: "HeartHandshake" });
    }
    if (smartProfileCount < 3) {
        insights.push({ priority: "recommended", title: "Expand digital evangelism", detail: `Only ${smartProfileCount} smart profile${smartProfileCount === 1 ? "" : "s"} created. Each QR profile is a personal outreach tool`, href: "/admin/evangelism/new", icon: "Share2" });
    }
    if (eventsWithNoRecap > 0) {
        insights.push({ priority: "recommended", title: "Add event recaps", detail: `${eventsWithNoRecap} past event${eventsWithNoRecap === 1 ? "" : "s"} have no recap or photos uploaded`, href: "/admin/events", icon: "Image" });
    }
    if (totalSessions === 0) {
        insights.push({ priority: "recommended", title: "Set up kiosk check-in", detail: "No service sessions recorded. Launch kiosk mode for your next Sunday service", href: "/admin/attendance/check-in", icon: "QrCode" });
    }
    if (insights.filter(i => i.priority === "urgent" || i.priority === "recommended").length === 0) {
        insights.push({ priority: "on-track", title: "Platform is healthy", detail: "Content is fresh, events are scheduled and the roster is confirmed. Keep it up!", href: "/admin", icon: "CheckCircle" });
    }

    // ─── Admin Story ────────────────────────────────────────────────────────────
    const loginDays = new Set(loginEvents30d.map(e => format(new Date(e.createdAt), "yyyy-MM-dd"))).size;
    const uniqueAdmins = new Set(loginEvents30d.filter(e => e.userId).map(e => e.userId)).size;
    const topAction = auditByAction30d[0];
    const lastAuditEntry = auditLogs30d[0];

    // ─── Attendance Patterns ────────────────────────────────────────────────────
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const byDay = [0, 0, 0, 0, 0, 0, 0];
    for (const { date } of attendanceRecords90d) {
        byDay[new Date(date).getDay()]++;
    }
    const busiestDay = byDay.every(c => c === 0) ? "" : dayNames[byDay.indexOf(Math.max(...byDay))];
    const attendanceByDay = dayNames.map((name, i) => ({ name, count: byDay[i] }));

    // ─── Charts Data ─────────────────────────────────────────────────────────────
    const growthMap = new Map<string, number>();
    for (let i = 5; i >= 0; i--) growthMap.set(format(subMonths(now, i), "MMM yy"), 0);
    for (const { createdAt } of rawMemberGrowth) {
        const label = format(new Date(createdAt), "MMM yy");
        if (growthMap.has(label)) growthMap.set(label, (growthMap.get(label) ?? 0) + 1);
    }
    const memberGrowth = Array.from(growthMap.entries()).map(([month, count]) => ({ month, count }));
    const attendance = recentSessions.reverse().map(s => ({ name: `${s.name} ${format(new Date(s.date), "d MMM")}`, headcount: s.headcount }));
    const linkClicksData = shortLinks.map(l => ({ slug: l.slug, clicks: l.clicks }));
    const auditActionsData = auditByAction30d.map(a => ({ action: a.action, count: a._count.action }));

    // ─── Print Audit ─────────────────────────────────────────────────────────────
    const serialisedAudit = fullAuditLog.map(e => ({ ...e, createdAt: e.createdAt.toISOString() }));
    const usersForAudit = allUsers.map(u => ({ id: u.id, name: u.name, email: u.email }));
    const auditActionStats = auditByAction30d.map(a => ({ action: a.action, count: a._count.action }));
    const auditDateRange = {
        from: fullAuditLog.length > 0 ? format(new Date(fullAuditLog[fullAuditLog.length - 1].createdAt), "d MMM yyyy") : "—",
        to: fullAuditLog.length > 0 ? format(new Date(fullAuditLog[0].createdAt), "d MMM yyyy") : "—",
    };

    const summaryStats = [
        { label: "Active Members", value: totalMembers, icon: Users, color: "text-blue-600 bg-blue-100" },
        { label: "Service Sessions", value: totalSessions, icon: ClipboardCheck, color: "text-green-600 bg-green-100" },
        { label: "Total Link Clicks", value: totalLinkClicks._sum.clicks ?? 0, icon: Link2, color: "text-purple-600 bg-purple-100" },
        { label: "Audit Events (30d)", value: auditCount30d, icon: ShieldCheck, color: "text-amber-600 bg-amber-100" },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="no-print">
                <h1 className="text-3xl font-bold tracking-tight">Analytics & Insights</h1>
                <p className="text-muted-foreground mt-1">Platform health, engagement patterns, and actionable recommendations</p>
            </div>

            {/* Top row: health score + summary stats */}
            <div className="grid gap-6 lg:grid-cols-3 no-print">
                <PlatformHealth score={healthScore} breakdown={healthBreakdown} />
                <div className="lg:col-span-2 grid grid-cols-2 gap-4 content-start">
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
            </div>

            {/* Actionable Insights */}
            <ActionableInsights insights={insights} />

            {/* Story Cards */}
            <StoryCards
                admin={{
                    loginDaysLast30: loginDays,
                    totalActionsLast30: auditLogs30d.length,
                    mostCommonAction: topAction?.action ?? "",
                    mostCommonActionCount: topAction?._count?.action ?? 0,
                    uniqueAdmins,
                    lastActivityDate: lastAuditEntry ? format(new Date(lastAuditEntry.createdAt), "d MMM yyyy, HH:mm") : null,
                }}
                engagement={{
                    busiestDay,
                    avgHeadcount: Math.round(avgHeadcountResult._avg.headcount ?? 0),
                    bestSession: topSessions[0] ? { name: topSessions[0].name, headcount: topSessions[0].headcount } : null,
                    checkInsLast30Days: checkIns30d,
                    memberRetentionPct: 0,
                }}
                content={{
                    daysSinceLastSermon,
                    lastSermonTitle: latestSermon?.title ?? null,
                    daysSinceLastAnnouncement,
                    upcomingEventTitle: nextEvent?.title ?? null,
                    daysUntilNextEvent,
                    eventsWithNoRecap,
                }}
            />

            {/* Charts */}
            <AnalyticsCharts
                memberGrowth={memberGrowth}
                attendance={attendance}
                linkClicks={linkClicksData}
                auditActions={auditActionsData}
                attendanceByDay={attendanceByDay}
            />

            {/* Audit Report */}
            <AuditPrintTable
                entries={serialisedAudit}
                users={usersForAudit}
                actionStats={auditActionStats}
                dateRange={auditDateRange}
            />
        </div>
    );
}
