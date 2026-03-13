"use client";

import { useState } from "react";
import Papa from "papaparse";
import { bulkImportMembersAction } from "@/app/actions/import";
import Link from "next/link";
import { ArrowLeft, Upload, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function ImportMembersPage() {
    const [file, setFile] = useState<File | null>(null);
    const [data, setData] = useState<any[]>([]);
    const [isParsing, setIsParsing] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [result, setResult] = useState<{ success: number; errors: string[] } | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setResult(null);
            setData([]);
        }
    };

    const handleParse = () => {
        if (!file) return;
        setIsParsing(true);
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                setData(results.data);
                setIsParsing(false);
            },
            error: (error) => {
                console.error(error);
                setIsParsing(false);
                alert("Error parsing CSV");
            }
        });
    };

    const handleImport = async () => {
        if (data.length === 0) return;
        setIsImporting(true);

        // Normalize keys to camelCase if needed, but assuming user uses correct headers for now
        // Expected headers: firstName, lastName, email, phone, address, birthday, gender, status
        // Make simpler: Map keys to lowercase and match

        const normalizedData = data.map((row: any) => {
            const newRow: any = {};
            Object.keys(row).forEach(key => {
                const lowerKey = key.toLowerCase().trim();
                if (lowerKey.includes("first")) newRow.firstName = row[key];
                else if (lowerKey.includes("last")) newRow.lastName = row[key];
                else if (lowerKey.includes("mail")) newRow.email = row[key];
                else if (lowerKey.includes("phone")) newRow.phone = row[key];
                else if (lowerKey.includes("address")) newRow.address = row[key];
                else if (lowerKey.includes("birth")) newRow.birthday = row[key];
                else if (lowerKey.includes("gender")) newRow.gender = row[key];
                else if (lowerKey.includes("status")) newRow.status = row[key];
            });
            return newRow;
        });

        const res = await bulkImportMembersAction(normalizedData);
        setResult(res);
        setIsImporting(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/members"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-background text-muted-foreground transition-colors hover:bg-muted"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <h1 className="text-2xl font-bold tracking-tight">Bulk Import Members</h1>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 max-w-3xl">
                {!result ? (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Upload CSV File</label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={handleFileChange}
                                    className="block w-full text-sm text-slate-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary file:text-primary-foreground
                    hover:file:bg-primary/90"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Headers required: FirstName, LastName. Optional: Email, Phone, Address, Birthday, Gender, Status.
                            </p>
                        </div>

                        {file && !data.length && (
                            <button
                                onClick={handleParse}
                                disabled={isParsing}
                                className="inline-flex items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-sm hover:bg-secondary/80 disabled:opacity-50"
                            >
                                {isParsing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
                                Parse File
                            </button>
                        )}

                        {data.length > 0 && (
                            <div className="space-y-4">
                                <div className="bg-muted p-4 rounded-md">
                                    <p className="text-sm font-medium">Ready to import {data.length} records.</p>
                                    <div className="mt-2 max-h-40 overflow-auto border rounded bg-background text-xs font-mono p-2">
                                        <pre>{JSON.stringify(data[0], null, 2)}</pre>
                                        {data.length > 1 && <p className="mt-1 text-muted-foreground">...and {data.length - 1} more</p>}
                                    </div>
                                </div>

                                <button
                                    onClick={handleImport}
                                    disabled={isImporting}
                                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50"
                                >
                                    {isImporting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Importing...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="mr-2 h-4 w-4" />
                                            Run Import
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className={`p-4 rounded-md border ${result.success > 0 ? "bg-green-500/10 border-green-500/20" : "bg-muted"}`}>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                <h3 className="font-semibold text-green-800 dark:text-green-400">Import Completed</h3>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">Successfully imported {result.success} members.</p>
                        </div>

                        {result.errors.length > 0 && (
                            <div className="p-4 rounded-md border bg-destructive/10 border-destructive/20">
                                <div className="flex items-center gap-2 mb-2">
                                    <AlertCircle className="h-5 w-5 text-destructive" />
                                    <h3 className="font-semibold text-destructive">Errors ({result.errors.length})</h3>
                                </div>
                                <ul className="list-disc pl-5 text-sm text-destructive/80 space-y-1 max-h-40 overflow-auto">
                                    {result.errors.map((err, i) => (
                                        <li key={i}>{err}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="flex gap-4">
                            <button
                                onClick={() => { setFile(null); setData([]); setResult(null); }}
                                className="px-4 py-2 text-sm font-medium text-primary hover:underline"
                            >
                                Import Another File
                            </button>
                            <Link href="/admin/members" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
                                View Members
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
