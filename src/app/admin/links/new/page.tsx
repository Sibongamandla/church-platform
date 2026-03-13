"use client";

import { useActionState } from "react";
import { createLinkAction } from "@/app/actions/links";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";

export default function NewLinkPage() {
    const [state, action, isPending] = useActionState(createLinkAction, null);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/links"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-background text-muted-foreground transition-colors hover:bg-muted"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <h1 className="text-2xl font-bold tracking-tight">Create Short Link</h1>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 max-w-2xl">
                <form action={action} className="space-y-6">
                    {state?.error && (
                        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive font-medium">
                            {state.error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label htmlFor="slug" className="text-sm font-medium">
                            Slug (e.g. welcome)
                        </label>
                        <div className="flex items-center">
                            <span className="bg-muted px-3 py-2 border border-r-0 rounded-l-md text-sm text-muted-foreground">church.com/go/</span>
                            <input
                                id="slug"
                                name="slug"
                                required
                                pattern="^[a-z0-9-]+$"
                                className="flex h-10 w-full rounded-r-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                placeholder="welcome"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="url" className="text-sm font-medium">
                            Destination URL
                        </label>
                        <input
                            id="url"
                            name="url"
                            type="url"
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            placeholder="https://..."
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
                                    Create Link
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
