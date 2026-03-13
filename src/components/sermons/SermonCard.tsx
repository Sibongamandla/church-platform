"use client";

import Link from "next/link";
import { Play, Calendar, User, Quote, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface SermonProps {
    id: string;
    title: string;
    series: string;
    speaker: string;
    date: string;
    thumbnail: string;
    slug: string;
    videoUrl?: string;
    highlightQuote?: string | null;
}

export function SermonCard({ sermon }: { sermon: SermonProps }) {
    return (
        <div className="group relative flex flex-col rounded-[2.5rem] border border-muted bg-card shadow-sm hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 overflow-hidden">
            {/* Thumbnail Area */}
            <div className="aspect-video relative overflow-hidden">
                <img 
                    src={sermon.thumbnail || "/pastor_preaching.png"} 
                    alt={sermon.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500" />
                
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-primary/90 backdrop-blur-md flex items-center justify-center shadow-2xl scale-90 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <Play className="h-7 w-7 fill-current text-primary-foreground ml-1" />
                    </div>
                </div>

                {/* Series Badge */}
                <div className="absolute top-6 left-6">
                    <span className="px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md text-primary text-[10px] font-black uppercase tracking-widest shadow-xl">
                        {sermon.series}
                    </span>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-8 space-y-6 flex-1 flex flex-col justify-between relative">
                <div className="space-y-4">
                    <h3 className="text-2xl font-heading font-black uppercase tracking-tighter leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {sermon.title}
                    </h3>

                    {sermon.highlightQuote && (
                        <div className="relative py-2 px-4 border-l-4 border-primary/20 italic text-muted-foreground text-sm font-medium line-clamp-2">
                            "{sermon.highlightQuote}"
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-muted/50 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        {sermon.speaker}
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        {sermon.date}
                    </div>
                </div>

                {/* Hover Glow */}
                <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-primary/5 rounded-full blur-[40px] group-hover:bg-primary/10 transition-all" />
            </div>

            <Link href={`/sermons/${sermon.id}`} className="absolute inset-0 z-20">
                <span className="sr-only">Watch {sermon.title}</span>
            </Link>
        </div>
    );
}
