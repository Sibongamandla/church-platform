"use client";

import { useActionState } from "react";
import { ArrowLeft, Calendar, Save, AlertCircle } from "lucide-react";
import Link from "next/link";
import { createManualSessionAction, type ManualSessionState } from "@/app/actions/sessions";

const initialState: ManualSessionState = {};

export function ManualSessionForm() {
    const [state, formAction, isPending] = useActionState(createManualSessionAction, initialState);

    return (
        <form action={formAction} className="bg-card border rounded-xl p-8 shadow-sm space-y-6">
            {state.message && (
                <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive flex gap-3">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <p>{state.message}</p>
                </div>
            )}

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">
                        Session Name
                    </label>
                    <input
                        name="name"
                        required
                        placeholder="e.g., Youth Night, Prayer Meeting"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    {state.errors?.name && (
                        <p className="text-xs text-destructive">{state.errors.name[0]}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">
                        Date
                    </label>
                    <input
                        name="date"
                        type="date"
                        required
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    {state.errors?.date && (
                        <p className="text-xs text-destructive">{state.errors.date[0]}</p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">
                            Start Time
                        </label>
                        <input
                            name="startTime"
                            type="time"
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">
                            End Time
                        </label>
                        <input
                            name="endTime"
                            type="time"
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                    </div>
                </div>
            </div>

            <div className="pt-4 flex gap-4">
                <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                    {isPending ? "Creating..." : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Create Session
                        </>
                    )}
                </button>
                <Link
                    href="/admin/attendance"
                    className="inline-flex items-center justify-center rounded-md border bg-background px-8 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-muted"
                >
                    Cancel
                </Link>
            </div>
        </form>
    );
}
