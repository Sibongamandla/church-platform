"use client";

import Link from "next/link";
import { Play, Calendar, User, Quote, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

interface Sermon {
    id: string;
    title: string;
    speaker: string;
    date: Date;
    videoUrl: string;
    description?: string | null;
    highlightQuote?: string | null;
    highlightVideoUrl?: string | null;
}

export function LatestSermon({ sermon }: { sermon: Sermon }) {
    if (!sermon) return null;

    return (
        <section className="py-24 bg-neutral-950 text-white overflow-hidden relative">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 blur-[120px] -z-10" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-amber-500/5 blur-[100px] -z-10" />

            <div className="container px-4 md:px-6">
                <div className="flex flex-col lg:flex-row gap-16 items-center">
                    
                    {/* Content Section */}
                    <div className="lg:w-1/2 space-y-8 animate-fade-in-up">
                        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 w-fit">
                            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Most Recent Message</span>
                        </div>

                        <h2 className="text-5xl md:text-7xl font-heading font-black uppercase tracking-tighter leading-none">
                            {sermon.title}
                        </h2>

                        <div className="flex flex-wrap gap-6 text-white/60 font-medium">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-primary" />
                                {sermon.speaker}
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-primary" />
                                {format(new Date(sermon.date), "MMMM d, yyyy")}
                            </div>
                        </div>

                        {sermon.highlightQuote && (
                            <div className="relative p-8 rounded-3xl bg-white/5 border border-white/10 max-w-lg">
                                <Quote className="absolute -top-4 -left-4 h-10 w-10 text-primary opacity-50" />
                                <p className="text-xl italic font-medium leading-relaxed text-white/90">
                                    "{sermon.highlightQuote}"
                                </p>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link href={`/sermons/${sermon.id}`}>
                                <Button size="lg" className="rounded-2xl px-10 h-16 font-black uppercase tracking-widest bg-primary text-primary-foreground shadow-2xl shadow-primary/20">
                                    Watch Full Sermon
                                </Button>
                            </Link>
                            <Link href="/sermons">
                                <Button variant="outline" size="lg" className="rounded-2xl px-10 h-16 font-bold border-2 border-white/20 hover:bg-white/10 transition-all text-white">
                                    Browse Archive
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Preview Section */}
                    <div className="lg:w-1/2 w-full relative group animate-fade-in-up delay-200">
                        <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border-8 border-white/5 shadow-2xl">
                            <img 
                                src="/pastor_preaching.png" // Using the generated pastor image
                                alt={sermon.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all duration-500">
                                <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                                    <Play className="h-10 w-10 fill-current text-primary-foreground ml-1" />
                                </div>
                            </div>
                            
                            {/* Floating "Highlight" Label */}
                            <div className="absolute top-6 left-6 px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-white">Sermon Highlight</span>
                            </div>
                        </div>

                        {/* Interactive Decor */}
                        <div className="absolute -bottom-10 -right-10 h-40 w-40 bg-primary/20 rounded-full blur-[60px] animate-pulse" />
                    </div>
                </div>
            </div>
        </section>
    );
}
