"use client";

import { useActionState } from "react";
import { createAnnouncementAction } from "@/app/actions/announcements";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";

export default function NewAnnouncementPage() {
    const [state, action, isPending] = useActionState(createAnnouncementAction, null);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/announcements"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-background text-muted-foreground transition-colors hover:bg-muted"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <h1 className="text-2xl font-bold tracking-tight">New Announcement</h1>
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
                            Title
                        </label>
                        <input
                            id="title"
                            name="title"
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            placeholder="Community Picnic"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="date" className="text-sm font-medium">
                                Display Date
                            </label>
                            <input
                                id="date"
                                name="date"
                                type="datetime-local"
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="category" className="text-sm font-medium">
                                Category
                            </label>
                            <select
                                id="category"
                                name="category"
                                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                                <option value="General">General</option>
                                <option value="Event">Event</option>
                                <option value="Series">Series</option>
                                <option value="Youth">Youth</option>
                                <option value="Alert">Alert</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="content" className="text-sm font-medium">
                            Content
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            rows={4}
                            required
                            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            placeholder="Announcement details..."
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
                                    Post Announcement
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
