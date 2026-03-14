"use client";

import { useActionState, useState } from "react";
import { updateSermonAction } from "@/app/actions/sermons";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { Loader2, Save } from "lucide-react";

export function EditSermonForm({ sermon }: { sermon: any }) {
    const [state, action, isPending] = useActionState(updateSermonAction, null);
    const [thumbnailUrl, setThumbnailUrl] = useState(sermon.thumbnailUrl || "");

    const dateStr = new Date(sermon.date).toISOString().split("T")[0];

    return (
        <form action={action} className="bg-card border rounded-xl p-6 space-y-5 shadow-sm">
            <input type="hidden" name="id" value={sermon.id} />
            
            {state?.error && (
                <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive font-medium">
                    {state.error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">Title *</label>
                    <input
                        id="title" name="title" required defaultValue={sermon.title}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="speaker" className="text-sm font-medium">Speaker *</label>
                    <input
                        id="speaker" name="speaker" required defaultValue={sermon.speaker}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                    <label htmlFor="series" className="text-sm font-medium">Series (Optional)</label>
                    <input
                        id="series" name="series" defaultValue={sermon.series || ""}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="date" className="text-sm font-medium">Date *</label>
                    <input
                        id="date" name="date" type="date" required defaultValue={dateStr}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                </div>
            </div>
            <div className="space-y-4 border-t pt-5 mt-5">
                <h3 className="text-lg font-semibold">Media & Previews</h3>
                <div className="space-y-2">
                    <label htmlFor="videoUrl" className="text-sm font-medium">Main Video URL *</label>
                    <input
                        id="videoUrl" name="videoUrl" type="url" required defaultValue={sermon.videoUrl}
                        placeholder="https://test.com/video.mp4"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Cover Image (Optional)</label>
                        <ImageUpload 
                            value={thumbnailUrl} 
                            onChange={setThumbnailUrl} 
                            placeholder="Upload sermon cover image"
                        />
                        <input type="hidden" name="thumbnailUrl" value={thumbnailUrl} />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="highlightVideoUrl" className="text-sm font-medium">Preview/Highlight Video URL</label>
                        <input
                            id="highlightVideoUrl" name="highlightVideoUrl" type="url" defaultValue={sermon.highlightVideoUrl || ""}
                            placeholder="Short clip URL"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label htmlFor="highlightQuote" className="text-sm font-medium">Highlight Quote (Optional)</label>
                    <input
                        id="highlightQuote" name="highlightQuote" defaultValue={sermon.highlightQuote || ""}
                        placeholder="A powerful statement..."
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                </div>
            </div>
            <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Description (Optional)</label>
                <textarea
                    id="description" name="description" rows={4} defaultValue={sermon.description || ""}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
            </div>
            <div className="flex gap-3 pt-2">
                <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                        </>
                    )}
                </button>
                <a href="/admin/sermons" className="inline-flex items-center justify-center rounded-md border px-6 py-2 text-sm font-medium transition-colors hover:bg-muted">
                    Cancel
                </a>
            </div>
        </form>
    );
}
