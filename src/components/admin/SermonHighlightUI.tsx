"use client";

import { useActionState } from "react";
import { updateSermonHighlightAction } from "@/app/actions/multimedia";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Quote, Video, Sparkles } from "lucide-react";
import Link from "next/link";

interface SermonHighlightUIProps {
    sermon: {
        id: string;
        title: string;
        highlightQuote?: string | null;
        highlightVideoUrl?: string | null;
    };
}

export function SermonHighlightUI({ sermon }: SermonHighlightUIProps) {
    const [state, action, isPending] = useActionState(updateSermonHighlightAction, null);

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <Link href="/admin/sermons" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Sermons
                </Link>
            </div>

            <div className="space-y-2">
                <span className="text-xs font-black uppercase tracking-widest text-primary">Sermon Highlights & Clips</span>
                <h1 className="text-4xl font-black uppercase tracking-tighter">{sermon.title}</h1>
                <p className="text-muted-foreground">Select a key moment or quote to feature this sermon across the platform.</p>
            </div>

            <form action={action} className="space-y-10 bg-card border rounded-[2.5rem] p-10 shadow-sm">
                <input type="hidden" name="sermonId" value={sermon.id} />

                {/* Highlight Quote */}
                <div className="space-y-4">
                    <label className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-foreground">
                        <Quote className="h-4 w-4 text-primary" />
                        Impactful Quote
                    </label>
                    <textarea
                        name="highlightQuote"
                        defaultValue={sermon.highlightQuote || ""}
                        placeholder="e.g., 'True victory is found in total surrender...'"
                        className="w-full min-h-[120px] rounded-2xl border bg-muted/30 p-6 focus:ring-2 focus:ring-primary focus:outline-none transition-all text-xl italic font-serif"
                    />
                </div>

                {/* Video Clip URL */}
                <div className="space-y-4">
                    <label className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-foreground">
                        <Video className="h-4 w-4 text-primary" />
                        Short Clip URL (YouTube/Vimeo)
                    </label>
                    <p className="text-xs text-muted-foreground pb-2">Provide a URL for a specific powerful segment (optional).</p>
                    <input
                        type="url"
                        name="highlightVideoUrl"
                        defaultValue={sermon.highlightVideoUrl || ""}
                        placeholder="https://youtube.com/watch?v=..."
                        className="w-full h-14 rounded-2xl border bg-muted/30 px-6 focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                    />
                </div>

                {state?.error && (
                    <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium">
                        {state.error}
                    </div>
                )}

                {state?.success && (
                    <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-600 text-sm font-medium">
                        Highlights published successfully!
                    </div>
                )}

                <div className="pt-4">
                    <Button 
                        type="submit" 
                        disabled={isPending}
                        className="w-full h-16 rounded-2xl font-black uppercase tracking-widest text-lg shadow-xl shadow-primary/20"
                    >
                        {isPending ? "Updating Highlights..." : "Save Highlights"}
                        <Save className="ml-2 h-5 w-5" />
                    </Button>
                </div>
            </form>
        </div>
    );
}
