"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { requestDataExportAction } from "@/app/actions/export";
import type { MemberExportField, ExportFormat } from "@/lib/export-types";

interface DataExportClientProps {
    exportFields: { key: MemberExportField; label: string; sensitive: boolean }[];
    exportHistory: any[];
    auditLogs: any[];
}

export function DataExportClient({ exportFields, exportHistory, auditLogs }: DataExportClientProps) {
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const [selectedFields, setSelectedFields] = useState<MemberExportField[]>(
        exportFields.map(f => f.key) // Default all selected
    );
    const [format, setFormat] = useState<ExportFormat>("csv");
    const [statusFilter, setStatusFilter] = useState<string>("");
    
    const [isExporting, setIsExporting] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const toggleField = (field: MemberExportField) => {
        setSelectedFields(prev => 
            prev.includes(field) 
                ? prev.filter(f => f !== field)
                : [...prev, field]
        );
    };

    const handleExport = async () => {
        if (selectedFields.length === 0) {
            setMessage({ type: "error", text: "Please select at least one field." });
            return;
        }

        setIsExporting(true);
        setMessage(null);

        const result = await requestDataExportAction({
            format,
            fields: selectedFields,
            statusFilter: statusFilter || undefined
        });

        setIsExporting(false);

        if (result.error) {
            setMessage({ type: "error", text: result.error });
        } else if (result.token) {
            setMessage({ type: "success", text: "Export ready! Downloading..." });
            // Trigger download via an invisible link to prevent navigation cancellation
            const a = document.createElement("a");
            a.href = `/api/export/${result.token}`;
            a.download = "export";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            // Refresh Server Component data without full page reload
            setTimeout(() => {
                router.refresh();
            }, 3000);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <div className="bg-white dark:bg-zinc-900 border rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Request New Export</h2>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Export Format</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="format" 
                                        value="csv" 
                                        checked={format === "csv"} 
                                        onChange={() => setFormat("csv")} 
                                    />
                                    <span>CSV (Excel)</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="format" 
                                        value="json" 
                                        checked={format === "json"} 
                                        onChange={() => setFormat("json")} 
                                    />
                                    <span>JSON (System Integration)</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Filter Members (Optional)</label>
                            <select 
                                value={statusFilter} 
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            >
                                <option value="">All Members</option>
                                <option value="ACTIVE">Active Only</option>
                                <option value="INACTIVE">Inactive Only</option>
                            </select>
                        </div>

                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <label className="block text-sm font-medium">Select Fields</label>
                                <div className="space-x-2 text-xs">
                                    <button onClick={() => setSelectedFields(exportFields.map(f => f.key))} className="text-blue-600 hover:underline">Select All</button>
                                    <button onClick={() => setSelectedFields([])} className="text-blue-600 hover:underline">Clear</button>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border rounded-md p-3 max-h-60 overflow-y-auto bg-zinc-50 dark:bg-zinc-950">
                                {exportFields.map((field) => (
                                    <label key={field.key} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 p-1 rounded">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedFields.includes(field.key)} 
                                            onChange={() => toggleField(field.key)} 
                                        />
                                        <span>
                                            {field.label}
                                            {field.sensitive && <span className="ml-1 text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full uppercase font-medium tracking-wide">PII</span>}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {message && (
                            <div className={`p-3 rounded-md text-sm ${message.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-green-50 text-green-800 border border-green-200'}`}>
                                {message.text}
                            </div>
                        )}

                        <button 
                            onClick={handleExport} 
                            disabled={isExporting}
                            className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isExporting ? (
                                <>
                                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                                    Processing...
                                </>
                            ) : (
                                "Generate & Download Export"
                            )}
                        </button>
                        <p className="text-xs text-center text-muted-foreground mt-2">
                            This action is audited and limited to 3 exports per hour.
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-white dark:bg-zinc-900 border rounded-xl shadow-sm overflow-hidden flex flex-col h-full max-h-[600px]">
                    <div className="p-4 border-b bg-zinc-50 dark:bg-zinc-950">
                        <h2 className="text-lg font-semibold">Recent Export History</h2>
                    </div>
                    <div className="overflow-y-auto p-0 flex-1">
                        {exportHistory.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">
                                <p>No previous exports found.</p>
                            </div>
                        ) : (
                            <ul className="divide-y">
                                {exportHistory.map((exp) => (
                                    <li key={exp.id} className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="font-medium flex items-center gap-2">
                                                {exp.scope === 'members' ? 'Member Data Export' : 'Data Export'}
                                                <span className="text-[10px] uppercase font-bold bg-zinc-200 dark:bg-zinc-700 px-1.5 py-0.5 rounded text-zinc-700 dark:text-zinc-300">
                                                    {exp.format}
                                                </span>
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {isMounted ? new Date(exp.createdAt).toLocaleString() : exp.createdAt.toString()}
                                            </div>
                                        </div>
                                        
                                        <div className="flex justify-between items-center mt-3">
                                            <div className="text-xs text-muted-foreground">
                                                {JSON.parse(exp.fields).length} fields selected
                                            </div>
                                            
                                            <div>
                                                {exp.status === 'DOWNLOADED' && (
                                                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-200">
                                                        Downloaded
                                                    </span>
                                                )}
                                                {exp.status === 'EXPIRED' && (
                                                    <span className="text-xs font-medium text-zinc-500 bg-zinc-100 px-2 py-1 rounded-full border border-zinc-200">
                                                        Expired
                                                    </span>
                                                )}
                                                {exp.status === 'PENDING' && (
                                                    <a href={`/api/export/${exp.token}`} className="text-xs font-medium text-blue-600 hover:underline">
                                                        Download Now
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
