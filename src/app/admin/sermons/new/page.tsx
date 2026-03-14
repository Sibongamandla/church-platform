import { createSermonAction } from "@/app/actions/sermons";
import { useState, useActionState } from "react";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { Loader2 } from "lucide-react";

export default function NewSermonPage() {
    const [state, action, isPending] = useActionState(createSermonAction, null);
    const [thumbnailUrl, setThumbnailUrl] = useState("");
    return (
        <div className="max-w-2xl space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Add a Sermon</h1>
                <p className="text-muted-foreground mt-1">Fill in the details to publish a sermon to the website.</p>
            </div>

            <form action={action} className="bg-card border rounded-xl p-6 space-y-5 shadow-sm">
                {state?.error && (
                    <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive font-medium">
                        {state.error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                        <label htmlFor="title" className="text-sm font-medium">Title *</label>
                        <input
                            id="title" name="title" required
                            placeholder="e.g. Walking by Faith"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="speaker" className="text-sm font-medium">Speaker *</label>
                        <input
                            id="speaker" name="speaker" required
                            placeholder="e.g. Pastor John"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                        <label htmlFor="series" className="text-sm font-medium">Series (Optional)</label>
                        <input
                            id="series" name="series"
                            placeholder="e.g. Gospel of John"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="date" className="text-sm font-medium">Date *</label>
                        <input
                            id="date" name="date" type="date" required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                    </div>
                </div>
                <div className="space-y-4 border-t pt-5 mt-5">
                    <h3 className="text-lg font-semibold">Media & Previews</h3>
                    <div className="space-y-2">
                        <label htmlFor="videoUrl" className="text-sm font-medium">Main Video URL *</label>
                        <input
                            id="videoUrl" name="videoUrl" type="url" required
                            placeholder="https://www.youtube.com/watch?v=... or direct MP4 link"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                        <p className="text-xs text-muted-foreground">YouTube, Vimeo, or direct video file links.</p>
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
                                id="highlightVideoUrl" name="highlightVideoUrl" type="url"
                                placeholder="Short clip URL (MP4 recommended)"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="highlightQuote" className="text-sm font-medium">Highlight Quote (Optional)</label>
                        <input
                            id="highlightQuote" name="highlightQuote"
                            placeholder="A powerful statement from the sermon..."
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">Description (Optional)</label>
                    <textarea
                        id="description" name="description" rows={4}
                        placeholder="A brief description of the sermon..."
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
                                Publishing...
                            </>
                        ) : (
                            "Publish Sermon"
                        )}
                    </button>
                    <a href="/admin/sermons" className="inline-flex items-center justify-center rounded-md border px-6 py-2 text-sm font-medium transition-colors hover:bg-muted">
                        Cancel
                    </a>
                </div>
            </form>
        </div>
    );
}
