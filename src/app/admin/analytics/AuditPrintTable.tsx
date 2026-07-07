"use client";

import { Printer } from "lucide-react";

interface AuditEntry {
    id: string;
    action: string;
    resource: string;
    details: string | null;
    ipAddress: string | null;
    createdAt: string;
}

interface Props {
    entries: AuditEntry[];
}

export function AuditPrintTable({ entries }: Props) {
    return (
        <>
            {/* Print styles injected inline so they travel with the component */}
            <style>{`
                @media print {
                    .no-print { display: none !important; }
                    .print-only { display: block !important; }
                    body { background: white !important; color: black !important; }
                    aside, header, nav { display: none !important; }
                    main { margin: 0 !important; padding: 0 !important; }
                    .print-audit-table th,
                    .print-audit-table td {
                        border: 1px solid #ccc;
                        padding: 6px 10px;
                        font-size: 11px;
                        text-align: left;
                    }
                    .print-audit-table th { background: #f3f4f6; font-weight: 600; }
                    .print-audit-table { border-collapse: collapse; width: 100%; }
                    .print-header { margin-bottom: 16px; }
                    @page { margin: 20mm; }
                }
                .print-only { display: none; }
            `}</style>

            {/* Print button — visible on screen only */}
            <button
                onClick={() => window.print()}
                className="no-print inline-flex items-center gap-2 rounded-md border bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-muted"
            >
                <Printer className="h-4 w-4" />
                Print Audit Report
            </button>

            {/* Audit table — visible on screen AND in print */}
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                {/* Screen header */}
                <div className="p-6 border-b no-print">
                    <h2 className="text-lg font-semibold">Audit Log</h2>
                    <p className="text-sm text-muted-foreground mt-1">All admin actions recorded by the system</p>
                </div>

                {/* Print-only report header */}
                <div className="print-only print-header p-4">
                    <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Great Nation Ministries — Audit Report</h1>
                    <p style={{ fontSize: 12, color: "#555", marginTop: 4 }}>
                        Generated: {new Date().toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })}
                        &nbsp;·&nbsp; {entries.length} records
                    </p>
                </div>

                {entries.length === 0 ? (
                    <p className="p-6 text-sm text-muted-foreground no-print">No audit entries recorded yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="print-audit-table w-full text-sm">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Resource</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Details</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">IP</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {entries.map((entry) => (
                                    <tr key={entry.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-4 py-3 whitespace-nowrap text-xs text-muted-foreground">
                                            {new Date(entry.createdAt).toLocaleDateString("en-ZA", {
                                                day: "numeric", month: "short", year: "numeric",
                                            })}{" "}
                                            <span className="text-muted-foreground/60">
                                                {new Date(entry.createdAt).toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" })}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary">
                                                {entry.action}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm">{entry.resource}</td>
                                        <td className="px-4 py-3 text-xs text-muted-foreground max-w-xs truncate">
                                            {entry.details ?? "—"}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-muted-foreground font-mono">
                                            {entry.ipAddress ?? "—"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}
