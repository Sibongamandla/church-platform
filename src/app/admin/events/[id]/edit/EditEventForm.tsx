"use client";

import { useActionState, useState } from "react";
import { updateEventAction } from "@/app/actions/events";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { ImageUpload } from "@/components/ui/ImageUpload";

export function EditEventForm({ event }: { event: any }) {
    const [state, action, isPending] = useActionState(updateEventAction, null);
    const [imageUrl, setImageUrl] = useState(event.imageUrl || "");

    // Format dates for input type="datetime-local"
    const formatDate = (date: Date) => {
        const d = new Date(date);
        return d.toISOString().slice(0, 16);
    };

    return (
        <form action={action} className="space-y-6">
            <input type="hidden" name="id" value={event.id} />
            
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
                    defaultValue={event.title}
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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
                        defaultValue={formatDate(event.startDate)}
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
                        defaultValue={formatDate(event.endDate)}
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
                    defaultValue={event.location || ""}
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">
                    Event Cover Image
                </label>
                <ImageUpload 
                    value={imageUrl} 
                    onChange={setImageUrl} 
                    placeholder="Upload event cover image"
                />
                <input type="hidden" name="imageUrl" value={imageUrl} />
            </div>

            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="isFeatured"
                    name="isFeatured"
                    defaultChecked={event.isFeatured}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="isFeatured" className="text-sm font-medium">
                    Feature this event on homepage
                </label>
            </div>

            <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    rows={4}
                    defaultValue={event.description || ""}
                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
            </div>

            <div className="pt-4 flex justify-end gap-3">
                <Link
                    href="/admin/events"
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
