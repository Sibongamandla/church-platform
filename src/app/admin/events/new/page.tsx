"use client";

import { useActionState } from "react";
import { createEventAction } from "@/app/actions/events";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";

export default function NewEventPage() {
    const [state, action, isPending] = useActionState(createEventAction, null);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/events"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-background text-muted-foreground transition-colors hover:bg-muted"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <h1 className="text-2xl font-bold tracking-tight">Create New Event</h1>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 max-w-2xl">
                <form action={action} className="space-y-6">
                    {state?.error && (
                        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive font-medium">
                            {state.error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label htmlFor="title" className="text-sm font-medium">
                            Event Title
                        </label>
                        <input
                            id="title"
                            name="title"
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            placeholder="Sunday Service"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="startDate" className="text-sm font-medium">
                                Start Date & Time
                            </label>
                            <input
                                id="startDate"
                                name="startDate"
                                type="datetime-local"
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="endDate" className="text-sm font-medium">
                                End Date & Time
                            </label>
                            <input
                                id="endDate"
                                name="endDate"
                                type="datetime-local"
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="location" className="text-sm font-medium">
                            Location
                        </label>
                        <input
                            id="location"
                            name="location"
                            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            placeholder="Main Sanctuary"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="description" className="text-sm font-medium">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            placeholder="Event details..."
                        />
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-wait"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Create Event
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
