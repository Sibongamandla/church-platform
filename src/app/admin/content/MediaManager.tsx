"use client";

import { useActionState, useState } from "react";
import { Save, Image as ImageIcon } from "lucide-react";
import { upsertSiteMediaAction } from "@/app/actions/content";
import { ImageUpload } from "@/components/ui/ImageUpload";

const initialState: { error?: string; success?: boolean } = {};

interface MediaPlacement {
    key: string;
    label: string;
    description: string;
    defaultUrl: string;
}

const PLACEMENTS: MediaPlacement[] = [
    {
        key: "sermons_header_bg",
        label: "Sermons Page Header",
        description: "Background image for the sermons listing page header section.",
        defaultUrl: "/pastor_preaching.png"
    },
    {
        key: "events_header_bg",
        label: "Events Page Header",
        description: "Background image for the events listing page header section.",
        defaultUrl: "/church_venue_exterior.png"
    },
    {
        key: "announcements_header_bg",
        label: "Announcements Page Header",
        description: "Background image for the news and updates listing page header section.",
        defaultUrl: "/church_venue_exterior.png"
    },
    {
        key: "home_events_preview_bg",
        label: "Home: Events Preview Decoration",
        description: "The decorative image shown next to the upcoming events list on the home page.",
        defaultUrl: "/worship_congregation.png"
    },
    {
        key: "home_latest_sermon_bg",
        label: "Home: Latest Sermon Preview",
        description: "The preview player image for the latest sermon featured on the home page.",
        defaultUrl: "/pastor_preaching.png"
    }
];

export function MediaManager({ initialMedia }: { initialMedia: Record<string, string> }) {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold">Site Media & Backgrounds</h2>
                <p className="text-muted-foreground mt-1">Manage static background images across the platform</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {PLACEMENTS.map((placement) => (
                    <MediaCard 
                        key={placement.key} 
                        placement={placement} 
                        currentUrl={initialMedia[placement.key] || placement.defaultUrl} 
                    />
                ))}
            </div>
        </div>
    );
}

function MediaCard({ placement, currentUrl }: { placement: MediaPlacement; currentUrl: string }) {
    const [state, formAction, isPending] = useActionState(upsertSiteMediaAction, initialState);
    const [imageUrl, setImageUrl] = useState(currentUrl);

    return (
        <div className="bg-card border rounded-xl overflow-hidden shadow-sm flex flex-col">
            <div className="aspect-video relative bg-muted group">
                <img
                    src={imageUrl}
                    alt={placement.label}
                    className="object-cover w-full h-full transition-opacity group-hover:opacity-90"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                    <ImageIcon className="text-white h-12 w-12" />
                </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col space-y-4">
                <div>
                    <h3 className="font-bold text-lg">{placement.label}</h3>
                    <p className="text-sm text-muted-foreground">{placement.description}</p>
                </div>

                <form action={formAction} className="space-y-4 mt-auto">
                    <input type="hidden" name="key" value={placement.key} />
                    <input type="hidden" name="label" value={placement.label} />
                    <input type="hidden" name="url" value={imageUrl} />

                    <ImageUpload 
                        value={imageUrl} 
                        onChange={setImageUrl} 
                        placeholder={`Upload ${placement.label.toLowerCase()}`}
                    />

                    {state?.error && (
                        <p className="text-sm text-destructive font-medium">{state.error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isPending || imageUrl === currentUrl}
                        className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2 transition-all font-bold"
                    >
                        <Save className="h-4 w-4" /> 
                        {isPending ? "Updating..." : imageUrl === currentUrl ? "Saved" : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
}
