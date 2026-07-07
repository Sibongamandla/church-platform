"use client";

import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface MemberGrowthPoint {
    month: string;
    count: number;
}

interface AttendancePoint {
    name: string;
    headcount: number;
}

interface LinkClick {
    slug: string;
    clicks: number;
}

interface AuditActionCount {
    action: string;
    count: number;
}

interface Props {
    memberGrowth: MemberGrowthPoint[];
    attendance: AttendancePoint[];
    linkClicks: LinkClick[];
    auditActions: AuditActionCount[];
}

const CHART_COLOR = "#16a34a";
const BAR_COLOR = "#2563eb";

export function AnalyticsCharts({ memberGrowth, attendance, linkClicks, auditActions }: Props) {
    return (
        <div className="space-y-8 no-print">
            {/* Member Growth */}
            <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-1">Member Growth</h2>
                <p className="text-sm text-muted-foreground mb-6">New members added per month (last 6 months)</p>
                {memberGrowth.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">No member data yet.</p>
                ) : (
                    <ResponsiveContainer width="100%" height={240}>
                        <LineChart data={memberGrowth} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{ fontSize: 13, borderRadius: 8 }}
                                formatter={(v) => [v, "New Members"]}
                            />
                            <Line
                                type="monotone"
                                dataKey="count"
                                stroke={CHART_COLOR}
                                strokeWidth={2.5}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* Attendance Trends */}
            <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-1">Attendance Trends</h2>
                <p className="text-sm text-muted-foreground mb-6">Headcount for the last 12 service sessions</p>
                {attendance.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">No session data yet.</p>
                ) : (
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={attendance} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={48} />
                            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{ fontSize: 13, borderRadius: 8 }}
                                formatter={(v) => [v, "Headcount"]}
                            />
                            <Bar dataKey="headcount" fill={BAR_COLOR} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* Short Link Clicks */}
            <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-1">Short Link Clicks</h2>
                <p className="text-sm text-muted-foreground mb-6">Total clicks per short link</p>
                {linkClicks.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">No short links created yet.</p>
                ) : (
                    <ResponsiveContainer width="100%" height={Math.max(160, linkClicks.length * 44)}>
                        <BarChart
                            data={linkClicks}
                            layout="vertical"
                            margin={{ top: 4, right: 32, left: 16, bottom: 0 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                            <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
                            <YAxis type="category" dataKey="slug" tick={{ fontSize: 12 }} width={100} />
                            <Tooltip
                                contentStyle={{ fontSize: 13, borderRadius: 8 }}
                                formatter={(v) => [v, "Clicks"]}
                            />
                            <Bar dataKey="clicks" fill={CHART_COLOR} radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* Audit Activity */}
            <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-1">Audit Activity</h2>
                <p className="text-sm text-muted-foreground mb-6">Admin actions by type — last 30 days</p>
                {auditActions.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">No audit activity in the last 30 days.</p>
                ) : (
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={auditActions} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="action" tick={{ fontSize: 11 }} />
                            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{ fontSize: 13, borderRadius: 8 }}
                                formatter={(v) => [v, "Events"]}
                            />
                            <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}
