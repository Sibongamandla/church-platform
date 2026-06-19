import { requireRole } from "@/lib/auth";
import { DataExportClient } from "./DataExportClient";
import { getExportHistoryAction, getRecentAuditLogsAction } from "@/app/actions/export";
import { MEMBER_EXPORT_FIELDS } from "@/lib/export-types";
export default async function DataExportPage() {
    await requireRole("SUPER_ADMIN");

    const [exportHistory, auditLogs] = await Promise.all([
        getExportHistoryAction(),
        getRecentAuditLogsAction(),
    ]);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Data Export</h1>
                <p className="text-muted-foreground mt-1">
                    Securely export member data with full audit trail.
                </p>
            </div>

            {/* Security Notice */}
            <div className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 p-4">
                <div className="flex gap-3">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-amber-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                            Sensitive Data Warning
                        </h3>
                        <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                            Exported data may contain personally identifiable information (PII) including
                            names, contact details, and addresses. Handle exported files with care and
                            in compliance with POPIA regulations. All exports are logged for security.
                        </p>
                    </div>
                </div>
            </div>

            <DataExportClient
                exportFields={MEMBER_EXPORT_FIELDS}
                exportHistory={exportHistory}
                auditLogs={auditLogs}
            />
        </div>
    );
}
