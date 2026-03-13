import { createSermonAction } from "@/app/actions/sermons";

export default function NewSermonPage() {
    return (
        <div className="max-w-2xl space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Add a Sermon</h1>
                <p className="text-muted-foreground mt-1">Fill in the details to publish a sermon to the website.</p>
            </div>

            <form action={createSermonAction} className="bg-card border rounded-xl p-6 space-y-5 shadow-sm">
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
                <div className="space-y-2">
                    <label htmlFor="videoUrl" className="text-sm font-medium">Video URL *</label>
                    <input
                        id="videoUrl" name="videoUrl" type="url" required
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <p className="text-xs text-muted-foreground">Paste a YouTube or Vimeo link.</p>
                </div>
                <div className="space-y-2">
                    <label htmlFor="thumbnailUrl" className="text-sm font-medium">Thumbnail URL (Optional)</label>
                    <input
                        id="thumbnailUrl" name="thumbnailUrl" type="url"
                        placeholder="https://..."
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
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
                        className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                    >
                        Publish Sermon
                    </button>
                    <a href="/admin/sermons" className="inline-flex items-center justify-center rounded-md border px-6 py-2 text-sm font-medium transition-colors hover:bg-muted">
                        Cancel
                    </a>
                </div>
            </form>
        </div>
    );
}
