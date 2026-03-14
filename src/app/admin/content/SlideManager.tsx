"use client";

import { useActionState, useState } from "react";
import { Plus, Trash2, Edit2, Save, X, MoveUp, MoveDown } from "lucide-react";
import { upsertHomeSlideAction, deleteHomeSlideAction } from "@/app/actions/content";

const initialState: { error?: string; success?: boolean } = {};

export function SlideManager({ initialSlides }: { initialSlides: any[] }) {
    const [isAdding, setIsAdding] = useState(false);
    const [editingSlide, setEditingSlide] = useState<any>(null);
    const [state, formAction, isPending] = useActionState(upsertHomeSlideAction, initialState);

    const handleEdit = (slide: any) => {
        setEditingSlide(slide);
        setIsAdding(true);
    };

    const handleCancel = () => {
        setIsAdding(false);
        setEditingSlide(null);
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Homepage Slides</h2>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        <Plus className="h-4 w-4" /> Add Slide
                    </button>
                )}
            </div>

            {isAdding && (
                <form action={formAction} className="bg-card border rounded-xl p-6 shadow-sm space-y-4">
                    <input type="hidden" name="id" value={editingSlide?.id || ""} />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Title</label>
                            <input
                                name="title"
                                defaultValue={editingSlide?.title}
                                required
                                className="w-full rounded-md border p-2 focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Subtitle</label>
                            <input
                                name="subtitle"
                                defaultValue={editingSlide?.subtitle}
                                className="w-full rounded-md border p-2 focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Image URL</label>
                            <input
                                name="imageUrl"
                                defaultValue={editingSlide?.imageUrl}
                                required
                                className="w-full rounded-md border p-2 focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Link (Button URL)</label>
                            <input
                                name="link"
                                defaultValue={editingSlide?.link}
                                className="w-full rounded-md border p-2 focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Display Order</label>
                            <input
                                name="order"
                                type="number"
                                defaultValue={editingSlide?.order || 0}
                                className="w-full rounded-md border p-2 focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-2 pt-8">
                            <input
                                type="checkbox"
                                name="isActive"
                                id="isActive"
                                defaultChecked={editingSlide ? editingSlide.isActive : true}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <label htmlFor="isActive" className="text-sm font-medium">Active</label>
                        </div>
                    </div>

                    {state?.error && (
                        <p className="text-sm text-destructive font-medium">{state.error}</p>
                    )}

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
                        >
                            <Save className="h-4 w-4" /> {isPending ? "Saving..." : "Save Slide"}
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="border bg-background px-6 py-2 rounded-lg hover:bg-muted"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {initialSlides.map((slide) => (
                    <div key={slide.id} className="group relative bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="aspect-video relative overflow-hidden bg-muted">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={slide.imageUrl}
                                alt={slide.title}
                                className="object-cover w-full h-full"
                            />
                            {!slide.isActive && (
                                <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                                    <span className="bg-muted px-2 py-1 rounded text-xs font-bold uppercase">Inactive</span>
                                </div>
                            )}
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-lg leading-tight mb-1">{slide.title}</h3>
                            <p className="text-xs text-muted-foreground mb-4 line-clamp-1">{slide.subtitle || "No subtitle"}</p>
                            
                            <div className="flex items-center justify-between pt-2 border-t">
                                <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">Order: {slide.order}</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(slide)}
                                        className="p-1.5 hover:bg-muted rounded-md text-primary"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (confirm("Delete this slide?")) {
                                                deleteHomeSlideAction(slide.id);
                                            }
                                        }}
                                        className="p-1.5 hover:bg-destructive/10 rounded-md text-destructive"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {initialSlides.length === 0 && !isAdding && (
                <div className="text-center py-20 border-2 border-dashed rounded-xl border-muted">
                    <p className="text-muted-foreground">No slides found. Click "Add Slide" to get started.</p>
                </div>
            )}
        </div>
    );
}
