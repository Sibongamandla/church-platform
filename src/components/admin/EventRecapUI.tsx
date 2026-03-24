"use client";

import { useActionState, useState } from "react";
import { updateEventRecapAction } from "@/app/actions/multimedia";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Image as ImageIcon, Sparkles, X, Plus } from "lucide-react";
import Link from "next/link";
import { ImageUpload } from "@/components/ui/ImageUpload";

interface EventRecapUIProps {
    event: {
        id: string;
        title: string;
        recapContent?: string | null;
        recapImages?: string[];
    };
}

export function EventRecapUI({ event }: EventRecapUIProps) {
    const [state, action, isPending] = useActionState(updateEventRecapAction, null);
    const [images, setImages] = useState<string[]>(event.recapImages || []);

    const addImage = (url: string) => {
        if (url && !images.includes(url)) {
            setImages([...images, url]);
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <Link href="/admin/events" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Events
                </Link>
            </div>

            <div className="space-y-2">
                <span className="text-xs font-black uppercase tracking-widest text-primary">Event Recap Management</span>
                <h1 className="text-4xl font-black uppercase tracking-tighter">{event.title}</h1>
                <p className="text-muted-foreground">Share the story and memories of what God did during this gathering.</p>
            </div>

            <form action={action} className="space-y-8 bg-card border rounded-[2.5rem] p-10 shadow-sm">
                <input type="hidden" name="eventId" value={event.id} />
                {/* Hidden input to pass comma-separated strings to the server action */}
                <input type="hidden" name="recapImages" value={images.join(",")} />

                {/* Recap Content */}
                <div className="space-y-4">
                    <label className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-foreground">
                        <Sparkles className="h-4 w-4 text-primary" />
                        The Story (Recap Content)
                    </label>
                    <textarea
                        name="recapContent"
                        defaultValue={event.recapContent || ""}
                        placeholder="Describe the atmosphere, the word shared, and any testimonies..."
                        className="w-full min-h-[300px] rounded-2xl border bg-muted/30 p-6 focus:ring-2 focus:ring-primary focus:outline-none transition-all text-lg leading-relaxed"
                        required
                    />
                </div>

                {/* Images Gallery */}
                <div className="space-y-6">
                    <label className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-foreground">
                        <ImageIcon className="h-4 w-4 text-primary" />
                        Memory Gallery
                    </label>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {images.map((url, index) => (
                            <div key={index} className="relative aspect-square rounded-2xl overflow-hidden group border shadow-sm">
                                <img 
                                    src={url} 
                                    alt={`Recap ${index + 1}`} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-2 right-2 p-1.5 bg-black/60 backdrop-blur-md text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                        
                        {/* New Image Upload */}
                        <div className="relative aspect-square">
                            <ImageUpload 
                                onChange={addImage} 
                                placeholder="Add Photo"
                                className="h-full w-full"
                            />
                        </div>
                    </div>
                </div>

                {state?.error && (
                    <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium">
                        {state.error}
                    </div>
                )}

                {state?.success && (
                    <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-600 text-sm font-medium">
                        Recap updated successfully!
                    </div>
                )}

                <div className="pt-4">
                    <Button 
                        type="submit" 
                        disabled={isPending}
                        className="w-full h-16 rounded-2xl font-black uppercase tracking-widest text-lg shadow-xl shadow-primary/20"
                    >
                        {isPending ? "Saving Memories..." : "Publish Recap"}
                        <Save className="ml-2 h-5 w-5" />
                    </Button>
                </div>
            </form>
        </div>
    );
}
