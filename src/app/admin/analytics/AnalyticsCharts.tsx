"use client";

import {
    LineChart, Line, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

interface MemberGrowthPoint { month: string; count: number; }
interface AttendancePoint { name: string; headcount: number; }
interface LinkClick { slug: string; clicks: number; }
interface AuditActionCount { action: string; count: number; }
interface DayCount { name: string; count: number; }

interface Props {
    memberGrowth: MemberGrowthPoint[];
    attendance: AttendancePoint[];
    linkClicks: LinkClick[];
    auditActions: AuditActionCount[];
    attendanceByDay: DayCount[];
}

const GREEN = "#16a34a";
const BLUE = "#2563eb";
const AMBER = "#f59e0b";
const PURPLE = "#7c3aed";

const DAY_COLORS = ["#7c3aed", "#2563eb", "#0891b2", "#059669", "#16a34a", "#ca8a04", "#dc2626"];

export function AnalyticsCharts({ memberGrowth, attendance, linkClicks, auditActions, attendanceByDay }: Props) {
    const maxDay = attendanceByDay.reduce((max, d) => d.count > max ? d.count : max, 0);

    return (
        <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Member Growth */}
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <h2 className="text-base font-semibold mb-1">Member Growth</h2>
                    <p className="text-xs text-muted-foreground mb-4">New members per month — last 6 months</p>
                    {memberGrowth.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">No member data yet.</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={memberGrowth} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v) => [v, "New Members"]} />
                                <Line type="monotone" dataKey="count" stroke={GREEN} strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Attendance by Day of Week */}
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <h2 className="text-base font-semibold mb-1">Busiest Check-in Days</h2>
                    <p className="text-xs text-muted-foreground mb-4">Total check-ins by day of week — last 90 days</p>
                    {attendanceByDay.every(d => d.count === 0) ? (
                        <p className="text-sm text-muted-foreground text-center py-8">No attendance data yet.</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={attendanceByDay} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis dataKey="name" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(0, 3)} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v) => [v, "Check-ins"]} />
                                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                    {attendanceByDay.map((entry, i) => (
                                        <Cell
                                            key={i}
                                            fill={entry.count === maxDay && maxDay > 0 ? GREEN : DAY_COLORS[i] + "99"}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                    {maxDay > 0 && (
                        <p className="text-xs text-muted-foreground mt-3 text-center">
                            Highlighted bar = busiest day
                        </p>
                    )}
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Attendance Trends */}
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <h2 className="text-base font-semibold mb-1">Service Session Headcounts</h2>
                    <p className="text-xs text-muted-foreground mb-4">Last 12 sessions by recorded headcount</p>
                    {attendance.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">No session data yet.</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={attendance} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={44} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v) => [v, "Headcount"]} />
                                <Bar dataKey="headcount" fill={BLUE} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Short Link Clicks */}
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <h2 className="text-base font-semibold mb-1">Short Link Clicks</h2>
                    <p className="text-xs text-muted-foreground mb-4">Ranked by total click count</p>
                    {linkClicks.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">No short links created yet.</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={Math.max(160, linkClicks.length * 40)}>
                            <BarChart data={linkClicks} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                                <YAxis type="category" dataKey="slug" tick={{ fontSize: 11 }} width={90} />
                                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v) => [v, "Clicks"]} />
                                <Bar dataKey="clicks" fill={PURPLE} radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* Audit Action Breakdown */}
            {auditActions.length > 0 && (
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <h2 className="text-base font-semibold mb-1">Admin Action Breakdown</h2>
                    <p className="text-xs text-muted-foreground mb-4">Platform actions by type — last 30 days</p>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={auditActions} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="action" tick={{ fontSize: 10 }} tickFormatter={(v) => v.replace(/_/g, " ")} angle={-15} textAnchor="end" height={44} />
                            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                            <Tooltip
                                contentStyle={{ fontSize: 12, borderRadius: 8 }}
                                formatter={(v) => [v, "Events"]}
                                labelFormatter={(l) => String(l).replace(/_/g, " ")}
                            />
                            <Bar dataKey="count" fill={AMBER} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}
