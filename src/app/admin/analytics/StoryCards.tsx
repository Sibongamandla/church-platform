"use client";

import { Users, ShieldCheck, FileText, TrendingUp, Clock, Activity } from "lucide-react";

interface AdminStory {
    loginDaysLast30: number;
    totalActionsLast30: number;
    mostCommonAction: string;
    mostCommonActionCount: number;
    uniqueAdmins: number;
    lastActivityDate: string | null;
}

interface EngagementStory {
    busiestDay: string;
    avgHeadcount: number;
    bestSession: { name: string; headcount: number } | null;
    checkInsLast30Days: number;
    memberRetentionPct: number;
}

interface ContentStory {
    daysSinceLastSermon: number | null;
    lastSermonTitle: string | null;
    daysSinceLastAnnouncement: number | null;
    upcomingEventTitle: string | null;
    daysUntilNextEvent: number | null;
    eventsWithNoRecap: number;
}

interface Props {
    admin: AdminStory;
    engagement: EngagementStory;
    content: ContentStory;
}

function StatusDot({ ok }: { ok: boolean }) {
    return (
        <span className={`inline-block h-2 w-2 rounded-full flex-shrink-0 ${ok ? "bg-green-500" : "bg-amber-400"}`} />
    );
}

function StoryRow({ label, value, ok }: { label: string; value: string; ok: boolean }) {
    return (
        <div className="flex items-center justify-between py-2 border-b last:border-0">
            <span className="text-sm text-muted-foreground">{label}</span>
            <div className="flex items-center gap-2">
                <StatusDot ok={ok} />
                <span className="text-sm font-medium text-right max-w-[180px] truncate">{value}</span>
            </div>
        </div>
    );
}

export function StoryCards({ admin, engagement, content }: Props) {
    const sermonOk = content.daysSinceLastSermon !== null && content.daysSinceLastSermon <= 14;
    const announcementOk = content.daysSinceLastAnnouncement !== null && content.daysSinceLastAnnouncement <= 14;
    const eventOk = content.daysUntilNextEvent !== null;

    const sermonText = content.daysSinceLastSermon === null
        ? "No sermons posted yet"
        : content.daysSinceLastSermon === 0
        ? `"${content.lastSermonTitle}" — today`
        : `${content.daysSinceLastSermon}d ago — "${content.lastSermonTitle}"`;

    const announcementText = content.daysSinceLastAnnouncement === null
        ? "No announcements yet"
        : `${content.daysSinceLastAnnouncement} day${content.daysSinceLastAnnouncement === 1 ? "" : "s"} ago`;

    const eventText = content.daysUntilNextEvent === null
        ? "No upcoming events"
        : content.daysUntilNextEvent === 0
        ? `Today — ${content.upcomingEventTitle}`
        : `In ${content.daysUntilNextEvent}d — ${content.upcomingEventTitle}`;

    const actionLabel = admin.mostCommonAction
        ? admin.mostCommonAction.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
        : "None";

    return (
        <div className="grid gap-6 md:grid-cols-3">
            {/* Admin Activity */}
            <div className="rounded-xl border bg-card shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                    <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-semibold text-sm">Admin Activity</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                    {admin.loginDaysLast30 === 0
                        ? "No admin logins recorded in the last 30 days."
                        : `Admins logged in on ${admin.loginDaysLast30} of the last 30 days across ${admin.uniqueAdmins} account${admin.uniqueAdmins === 1 ? "" : "s"}, with ${admin.totalActionsLast30} total platform actions.`}
                </p>
                <StoryRow label="Active days (30d)" value={`${admin.loginDaysLast30} days`} ok={admin.loginDaysLast30 >= 10} />
                <StoryRow label="Most common action" value={actionLabel} ok={true} />
                <StoryRow label="Total events (30d)" value={`${admin.totalActionsLast30} actions`} ok={admin.totalActionsLast30 > 0} />
                <StoryRow label="Last activity" value={admin.lastActivityDate ?? "N/A"} ok={!!admin.lastActivityDate} />
            </div>

            {/* Member Engagement */}
            <div className="rounded-xl border bg-card shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                    <div className="h-8 w-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="font-semibold text-sm">Member Engagement</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                    {engagement.busiestDay
                        ? `Your busiest check-in day is ${engagement.busiestDay}. On average, ${engagement.avgHeadcount} members attend each service session.`
                        : "No attendance data recorded yet. Set up kiosk check-ins to start tracking."}
                </p>
                <StoryRow label="Busiest day" value={engagement.busiestDay || "No data"} ok={!!engagement.busiestDay} />
                <StoryRow label="Avg headcount" value={engagement.avgHeadcount > 0 ? `${engagement.avgHeadcount} people` : "No data"} ok={engagement.avgHeadcount > 0} />
                <StoryRow label="Best session" value={engagement.bestSession ? `${engagement.bestSession.name} (${engagement.bestSession.headcount})` : "None"} ok={!!engagement.bestSession} />
                <StoryRow label="Check-ins (30d)" value={`${engagement.checkInsLast30Days}`} ok={engagement.checkInsLast30Days > 0} />
            </div>

            {/* Content Freshness */}
            <div className="rounded-xl border bg-card shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                    <div className="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="font-semibold text-sm">Content Freshness</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                    {sermonOk && announcementOk && eventOk
                        ? "Your content is fresh and up to date. Keep the momentum going!"
                        : "Some content areas need attention. Fresh content drives engagement."}
                </p>
                <StoryRow label="Last sermon" value={sermonText} ok={sermonOk} />
                <StoryRow label="Last announcement" value={announcementText} ok={announcementOk} />
                <StoryRow label="Next event" value={eventText} ok={eventOk} />
                <StoryRow label="Events without recap" value={content.eventsWithNoRecap > 0 ? `${content.eventsWithNoRecap} pending` : "All covered ✓"} ok={content.eventsWithNoRecap === 0} />
            </div>
        </div>
    );
}
