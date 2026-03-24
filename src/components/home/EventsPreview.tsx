"use client";

import Link from "next/link";
import { ArrowRight, MapPin, Calendar as CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

interface Event {
    id: string;
    title: string;
    startDate: Date;
    location: string | null;
    imageUrl?: string | null;
}

export function EventsPreview({ events, bgImage }: { events: Event[], bgImage?: string }) {
    const displayBg = bgImage || "/worship_congregation.png";
    return (
        <section className="py-32 bg-background overflow-hidden">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col lg:flex-row gap-20 items-start">
                    
                    {/* Section Header */}
                    <div className="lg:w-2/5 space-y-10 lg:sticky lg:top-32">
                        <div className="space-y-4">
                            <span className="inline-block px-4 py-2 rounded-full bg-primary/5 text-primary text-xs font-black uppercase tracking-[0.2em]">
                                Join the Family
                            </span>
                            <h2 className="text-6xl md:text-7xl font-heading font-black tracking-tighter text-primary uppercase leading-none">
                                Upcoming <br /> 
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Gatherings</span>
                            </h2>
                        </div>
                        <p className="text-muted-foreground text-xl leading-relaxed max-w-md font-medium">
                            There is always a seat for you. Connect to the life of the church through our various community events and services.
                        </p>
                        <div className="pt-4">
                            <Link href="/events">
                                <Button size="lg" className="rounded-2xl px-10 text-lg h-16 font-black uppercase tracking-widest shadow-xl shadow-primary/20">
                                    Full Calendar
                                </Button>
                            </Link>
                        </div>
+
                        {/* Visual Decoration */}
                        <div className="relative h-64 w-full rounded-[2rem] overflow-hidden hidden lg:block group shadow-2xl">
                             <img 
                                src={displayBg} 
                                alt="Worship" 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-primary/20 mix-blend-overlay" />
                        </div>
                    </div>

                    {/* Events List */}
                    <div className="lg:w-3/5 w-full space-y-8">
                        {events.length === 0 ? (
                            <div className="p-20 text-center bg-muted/30 rounded-[3rem] border-2 border-dashed border-muted flex flex-col items-center gap-6">
                                <CalendarIcon className="h-12 w-12 text-muted-foreground/50" />
                                <p className="text-muted-foreground text-xl font-medium tracking-tight">No upcoming events scheduled right now.</p>
                            </div>
                        ) : (
                            <div className="grid gap-6">
                                {events.map((event, index) => (
                                    <Link
                                        key={event.id}
                                        href={`/check-in`}
                                        className="group relative block bg-white dark:bg-neutral-900 rounded-[2.5rem] border border-muted dark:border-white/5 p-8 shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                                    >
                                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                                            {/* Date Banner */}
                                            <div className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-[2rem] bg-secondary text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-inner">
                                                <span className="text-xs font-black uppercase tracking-widest opacity-80 mb-1">
                                                    {format(new Date(event.startDate), "MMM")}
                                                </span>
                                                <span className="text-4xl font-heading font-black leading-none">
                                                    {format(new Date(event.startDate), "d")}
                                                </span>
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 space-y-3 text-center md:text-left">
                                                <h3 className="font-heading font-black text-3xl uppercase tracking-tighter group-hover:text-primary transition-colors leading-none">
                                                    {event.title}
                                                </h3>
                                                <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-muted-foreground font-semibold text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-4 w-4 text-amber-500" />
                                                        {format(new Date(event.startDate), "h:mm a")}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="h-4 w-4 text-amber-500" />
                                                        {event.location || "Great Nation Auditorium"}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Arrow */}
                                            <div className="hidden md:flex h-14 w-14 rounded-full border-2 border-primary/10 items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-500 group-hover:rotate-[-45deg]">
                                                <ArrowRight className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
                                            </div>
                                        </div>

                                        {/* Hover Effect Background */}
                                        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-32 w-32 rounded-full bg-primary/5 group-hover:scale-[5] transition-transform duration-1000" />
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* Bottom CTA for Mobile */}
                        <div className="lg:hidden pt-8">
                            <Link href="/events" className="block">
                                <Button variant="outline" className="w-full h-16 rounded-2xl text-lg font-bold border-2">
                                    See All Events
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
