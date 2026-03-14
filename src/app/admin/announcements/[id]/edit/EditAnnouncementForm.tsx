"use client";

import { useActionState, useState } from "react";
import { updateAnnouncementAction } from "@/app/actions/announcements";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { ImageUpload } from "@/components/ui/ImageUpload";

export function EditAnnouncementForm({ announcement }: { announcement: any }) {
    const [state, action, isPending] = useActionState(updateAnnouncementAction, null);
    const [imageUrl, setImageUrl] = useState(announcement.imageUrl || "");

    const dateStr = new Date(announcement.date).toISOString().slice(0, 16);

    return (
        <form action={action} className="space-y-6">
            <input type="hidden" name="id" value={announcement.id} />
            
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
                    defaultValue={announcement.title}
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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
                        defaultValue={dateStr}
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
                        defaultValue={announcement.category}
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
                <label className="text-sm font-medium">
                    Announcement Image (Optional)
                </label>
                <ImageUpload 
                    value={imageUrl} 
                    onChange={setImageUrl} 
                    placeholder="Upload announcement image"
                />
                <input type="hidden" name="imageUrl" value={imageUrl} />
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
                    defaultValue={announcement.content}
                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
            </div>

            <div className="pt-4 flex justify-end gap-3">
                <Link
                    href="/admin/announcements"
                    className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                >
                    Cancel
                </Link>
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
                            Save Changes
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
