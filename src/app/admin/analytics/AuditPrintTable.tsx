"use client";

import { Printer, ShieldCheck } from "lucide-react";

interface AuditEntry {
    id: string;
    action: string;
    resource: string;
    details: string | null;
    ipAddress: string | null;
    userId: string | null;
    createdAt: string;
}

interface AuditUser {
    id: string;
    name: string | null;
    email: string;
}

interface ActionStat {
    action: string;
    count: number;
}

interface Props {
    entries: AuditEntry[];
    users: AuditUser[];
    actionStats: ActionStat[];
    dateRange: { from: string; to: string };
}

const ACTION_DESCRIPTIONS: Record<string, string> = {
    LOGIN: "Admin sign-in",
    LOGOUT: "Admin sign-out",
    LOGIN_FAILED: "Failed login attempt",
    MEMBER_CREATE: "Member added",
    MEMBER_UPDATE: "Member record updated",
    MEMBER_DELETE: "Member removed",
    MEMBER_IMPORT: "Bulk member import",
    MEMBER_CHECK_IN: "Service check-in",
    EVENT_CREATE: "Event created",
    EVENT_UPDATE: "Event updated",
    EVENT_DELETE: "Event removed",
    ANNOUNCEMENT_CREATE: "Announcement posted",
    ANNOUNCEMENT_UPDATE: "Announcement updated",
    SERMON_CREATE: "Sermon uploaded",
    SERMON_UPDATE: "Sermon updated",
    CONTENT_UPDATE: "Homepage content updated",
    MEDIA_UPDATE: "Media asset updated",
    SESSION_CREATE: "Service session created",
    SESSION_SYNC: "Sessions synchronised",
    USER_CREATE: "Admin user created",
    USER_DELETE: "Admin user removed",
    USER_ROLE_CHANGE: "User role changed",
    DATA_EXPORT_REQUEST: "Data export requested",
    DATA_EXPORT_DOWNLOAD: "Export file downloaded",
    VOLUNTEER_SCHEDULE: "Volunteer scheduled",
    VOLUNTEER_STATUS_CHANGE: "Volunteer status changed",
    PROFILE_CREATE: "Evangelism profile created",
    PROFILE_UPDATE: "Evangelism profile updated",
    LINK_CREATE: "Short link created",
    LINK_DELETE: "Short link removed",
    FILE_UPLOAD: "File uploaded",
    TEAM_CREATE: "Team created",
    TEAM_MEMBER_ADD: "Team member added",
    CRON_ARCHIVE: "Automated archive run",
};

function actionLabel(action: string) {
    return ACTION_DESCRIPTIONS[action] ?? action.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

function groupByDate(entries: AuditEntry[]) {
    const map = new Map<string, AuditEntry[]>();
    for (const e of entries) {
        const key = new Date(e.createdAt).toLocaleDateString("en-ZA", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(e);
    }
    return map;
}

export function AuditPrintTable({ entries, users, actionStats, dateRange }: Props) {
    const userMap = new Map(users.map(u => [u.id, u]));
    const groupedEntries = groupByDate(entries);
    const totalActions = entries.length;
    const uniqueAdmins = new Set(entries.filter(e => e.userId).map(e => e.userId)).size;
    const topAction = actionStats[0];

    return (
        <>
            <style>{`
                @media print {
                    .no-print { display: none !important; }
                    .print-only { display: block !important; }
                    body { background: white !important; color: black !important; font-family: system-ui, sans-serif; }
                    aside, header, nav, .no-print { display: none !important; }
                    main { margin: 0 !important; padding: 0 !important; }
                    .print-audit-wrap { padding: 0; }
                    .print-summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
                    .print-summary-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; text-align: center; }
                    .print-summary-card .stat-value { font-size: 24px; font-weight: 700; margin: 4px 0; }
                    .print-summary-card .stat-label { font-size: 10px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; }
                    .print-action-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px; }
                    .print-action-table th, .print-action-table td { border: 1px solid #e5e7eb; padding: 6px 10px; text-align: left; }
                    .print-action-table th { background: #f9fafb; font-weight: 600; }
                    .print-detail-table { width: 100%; border-collapse: collapse; font-size: 10px; }
                    .print-detail-table th, .print-detail-table td { border: 1px solid #e5e7eb; padding: 5px 8px; text-align: left; }
                    .print-detail-table th { background: #f3f4f6; font-weight: 600; }
                    .print-date-header { font-size: 12px; font-weight: 700; background: #f9fafb; padding: 8px 10px; border-top: 2px solid #e5e7eb; margin-top: 12px; }
                    @page { margin: 18mm; }
                }
                .print-only { display: none; }
            `}</style>

            <div className="print-audit-wrap">
                {/* Screen header */}
                <div className="flex items-center justify-between mb-6 no-print">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                            <ShieldCheck className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">Audit Report</h2>
                            <p className="text-xs text-muted-foreground">{dateRange.from} → {dateRange.to} · {totalActions} recorded events</p>
                        </div>
                    </div>
                    <button
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-2 rounded-md border bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-muted transition-colors"
                    >
                        <Printer className="h-4 w-4" />
                        Print PDF
                    </button>
                </div>

                {/* Print-only report header */}
                <div className="print-only" style={{ marginBottom: 20 }}>
                    <h1 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 4px" }}>Great Nation Ministries — Audit Report</h1>
                    <p style={{ fontSize: 11, color: "#6b7280", margin: 0 }}>
                        Period: {dateRange.from} to {dateRange.to} &nbsp;·&nbsp; Generated: {new Date().toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                    <hr style={{ margin: "12px 0", borderColor: "#e5e7eb" }} />
                </div>

                {/* Summary stat cards — screen */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 no-print">
                    {[
                        { label: "Total Events", value: totalActions },
                        { label: "Active Admins", value: uniqueAdmins },
                        { label: "Most Common", value: topAction ? actionLabel(topAction.action) : "—" },
                        { label: "Top Count", value: topAction?.count ?? 0 },
                    ].map((s) => (
                        <div key={s.label} className="rounded-xl border bg-muted/30 p-4 text-center">
                            <p className="text-2xl font-bold">{s.value}</p>
                            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Print-only summary grid */}
                <div className="print-only print-summary-grid">
                    {[
                        { label: "Total Events", value: totalActions },
                        { label: "Active Admins", value: uniqueAdmins },
                        { label: "Most Common Action", value: topAction ? actionLabel(topAction.action) : "—" },
                        { label: "Top Action Count", value: topAction?.count ?? 0 },
                    ].map((s) => (
                        <div key={s.label} className="print-summary-card">
                            <div className="stat-label">{s.label}</div>
                            <div className="stat-value">{s.value}</div>
                        </div>
                    ))}
                </div>

                {/* Action breakdown table */}
                <div className="rounded-xl border bg-card shadow-sm overflow-hidden mb-6">
                    <div className="p-5 border-b no-print">
                        <h3 className="font-semibold text-sm">Action Breakdown</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">What happened on the platform</p>
                    </div>
                    <div className="print-only print-date-header" style={{ marginTop: 0 }}>Action Breakdown</div>
                    <div className="divide-y">
                        {actionStats.map((stat) => {
                            const pct = totalActions > 0 ? Math.round((stat.count / totalActions) * 100) : 0;
                            return (
                                <div key={stat.action} className="flex items-center gap-4 px-5 py-3 no-print">
                                    <div className="w-40 text-sm font-medium truncate">{actionLabel(stat.action)}</div>
                                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                        <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                                    </div>
                                    <div className="w-8 text-right text-sm font-bold">{stat.count}</div>
                                    <div className="w-10 text-right text-xs text-muted-foreground">{pct}%</div>
                                </div>
                            );
                        })}
                    </div>
                    {/* Print version of breakdown */}
                    <table className="print-action-table print-only">
                        <thead>
                            <tr>
                                <th>Action</th>
                                <th>Raw Action Code</th>
                                <th style={{ textAlign: "right" }}>Count</th>
                                <th style={{ textAlign: "right" }}>% of Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {actionStats.map((stat) => {
                                const pct = totalActions > 0 ? Math.round((stat.count / totalActions) * 100) : 0;
                                return (
                                    <tr key={stat.action}>
                                        <td>{actionLabel(stat.action)}</td>
                                        <td style={{ color: "#6b7280", fontFamily: "monospace" }}>{stat.action}</td>
                                        <td style={{ textAlign: "right", fontWeight: 600 }}>{stat.count}</td>
                                        <td style={{ textAlign: "right" }}>{pct}%</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Timeline view — screen */}
                <div className="rounded-xl border bg-card shadow-sm overflow-hidden no-print">
                    <div className="p-5 border-b">
                        <h3 className="font-semibold text-sm">Activity Timeline</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">Grouped by date, most recent first</p>
                    </div>
                    {entries.length === 0 ? (
                        <p className="p-6 text-sm text-muted-foreground text-center">No audit entries yet.</p>
                    ) : (
                        <div className="max-h-[600px] overflow-y-auto">
                            {Array.from(groupedEntries.entries()).map(([date, dayEntries]) => (
                                <div key={date}>
                                    <div className="px-5 py-2 bg-muted/40 border-y text-xs font-semibold text-muted-foreground uppercase tracking-wider sticky top-0">
                                        {date} · {dayEntries.length} action{dayEntries.length !== 1 ? "s" : ""}
                                    </div>
                                    {dayEntries.map((entry) => {
                                        const user = entry.userId ? userMap.get(entry.userId) : null;
                                        const time = new Date(entry.createdAt).toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" });
                                        return (
                                            <div key={entry.id} className="flex items-start gap-3 px-5 py-3 border-b last:border-0 hover:bg-muted/20 transition-colors">
                                                <div className="mt-0.5 h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                                    <ShieldCheck className="h-3.5 w-3.5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                                                        <span className="text-sm font-semibold">{actionLabel(entry.action)}</span>
                                                        <span className="text-xs text-muted-foreground">on {entry.resource}</span>
                                                        <span className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-mono bg-muted text-muted-foreground">
                                                            {entry.action}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-x-3 mt-0.5 text-xs text-muted-foreground">
                                                        <span>{time}</span>
                                                        {user && <span>by {user.name ?? user.email}</span>}
                                                        {entry.ipAddress && <span className="font-mono">{entry.ipAddress}</span>}
                                                        {entry.details && (
                                                            <span className="truncate max-w-xs opacity-70">{entry.details}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Print-only detailed table */}
                <div className="print-only" style={{ marginTop: 16 }}>
                    <div className="print-date-header" style={{ marginTop: 0 }}>Detailed Activity Log</div>
                    <table className="print-detail-table">
                        <thead>
                            <tr>
                                <th>Date &amp; Time</th>
                                <th>Action</th>
                                <th>Resource</th>
                                <th>Admin</th>
                                <th>IP Address</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entries.map((entry) => {
                                const user = entry.userId ? userMap.get(entry.userId) : null;
                                return (
                                    <tr key={entry.id}>
                                        <td style={{ whiteSpace: "nowrap", fontFamily: "monospace", fontSize: 9 }}>
                                            {new Date(entry.createdAt).toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" })}{" "}
                                            {new Date(entry.createdAt).toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" })}
                                        </td>
                                        <td style={{ fontWeight: 500 }}>{actionLabel(entry.action)}</td>
                                        <td>{entry.resource}</td>
                                        <td>{user ? (user.name ?? user.email) : "System"}</td>
                                        <td style={{ fontFamily: "monospace", fontSize: 9 }}>{entry.ipAddress ?? "—"}</td>
                                        <td style={{ fontSize: 9, color: "#6b7280", maxWidth: 120 }}>{entry.details ?? "—"}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
