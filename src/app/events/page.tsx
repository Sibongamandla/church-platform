import { getAllUpcomingEvents, getPastEvents } from "@/lib/cache";
import { format } from "date-fns";
import { Calendar, MapPin, Clock, Image as ImageIcon, Sparkles, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
    title: "Gatherings & Memories | Great Nation Ministries",
};

export default async function EventsPage() {
    const upcomingEvents = await getAllUpcomingEvents();
    const pastEventsRaw = await getPastEvents();
    const pastEvents = pastEventsRaw as any[];

    return (
        <div className="min-h-screen bg-background pb-32">
            {/* Massive Header Section */}
            <div className="relative py-32 md:py-48 flex flex-col items-center justify-center text-center overflow-hidden bg-neutral-900 text-white">
                <div className="absolute inset-0 bg-[url('/church_venue_exterior.png')] bg-cover bg-center opacity-30 mix-blend-overlay scale-110" />
                <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/80 via-transparent to-background pointer-events-none" />
                
                <div className="container relative z-10 px-4 space-y-8 animate-fade-in-up">
                    <span className="inline-block px-6 py-2 rounded-full bg-primary/20 backdrop-blur-md text-primary text-xs font-black uppercase tracking-[0.4em] border border-primary/30">
                        Fellowship & Connection
                    </span>
                    <h1 className="text-7xl md:text-[10rem] font-heading font-black uppercase text-white tracking-tighter leading-none">
                        Our <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-600">Gatherings</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl md:text-2xl text-white/70 font-medium leading-relaxed">
                        From powerful Sunday services to intimate community gatherings, there is a place for you to belong.
                    </p>
                </div>
            </div>

            {/* Upcoming Section */}
            <section className="container px-4 md:px-6 -mt-24 relative z-20">
                <div className="flex items-end justify-between mb-12">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs">
                            <Sparkles className="h-4 w-4" />
                            Don't Miss Out
                        </div>
                        <h2 className="text-5xl font-heading font-black uppercase tracking-tighter">Upcoming Events</h2>
                    </div>
                </div>

                {upcomingEvents.length === 0 ? (
                    <div className="w-full p-20 text-center bg-card rounded-[3rem] border-2 border-dashed border-muted shadow-sm flex flex-col items-center gap-6">
                        <Calendar className="h-16 w-16 text-muted-foreground/30" />
                        <div className="space-y-2">
                             <h3 className="text-2xl font-bold font-heading uppercase tracking-tight text-primary">No Scheduled Gatherings</h3>
                             <p className="text-muted-foreground max-w-sm mx-auto">We're currently preparing our next season of meetings. Check back soon for updates!</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {upcomingEvents.map((event) => (
                            <div
                                key={event.id}
                                className="group flex flex-col justify-between rounded-[3rem] border border-muted bg-card hover:border-primary/30 p-10 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 relative overflow-hidden"
                            >
                                <div className="space-y-8 relative z-10">
                                    {/* Date Badge */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col items-center justify-center h-24 w-24 rounded-[2rem] bg-secondary text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-inner">
                                            <span className="text-xs font-black uppercase tracking-[0.2em] opacity-80">
                                                {format(new Date(event.startDate), "MMM")}
                                            </span>
                                            <span className="text-4xl font-heading font-black leading-none">
                                                {format(new Date(event.startDate), "d")}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-4">
                                        <h3 className="text-3xl font-heading font-black uppercase tracking-tighter text-primary group-hover:text-amber-600 transition-colors leading-none">
                                            {event.title}
                                        </h3>
                                        <div className="flex flex-col gap-3 text-muted-foreground text-sm font-bold">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                                                    <Clock className="h-4 w-4 text-amber-500" />
                                                </div>
                                                {format(new Date(event.startDate), "h:mm a")} - {format(new Date(event.endDate), "h:mm a")}
                                            </div>
                                            {event.location && (
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                                                        <MapPin className="h-4 w-4 text-amber-500" />
                                                    </div>
                                                    {event.location}
                                                </div>
                                            )}
                                        </div>
                                        {event.description && (
                                            <p className="text-muted-foreground line-clamp-3 leading-relaxed pt-2 font-medium">
                                                {event.description}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-10 pt-8 border-t border-muted/50 relative z-10">
                                    <Link href="/check-in" className="w-full">
                                        <Button className="w-full h-14 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/10 group-hover:scale-[1.02] transition-transform">
                                            Plan My Visit
                                        </Button>
                                    </Link>
                                </div>
                                
                                {/* Decor */}
                                <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-primary/5 group-hover:scale-[3] transition-transform duration-1000 -z-0" />
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Past Events / Recaps Section */}
            <section className="container px-4 md:px-6 mt-32">
                <div className="flex items-end justify-between mb-16 border-b-4 border-primary/10 pb-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-muted-foreground font-black uppercase tracking-widest text-xs">
                            <ImageIcon className="h-4 w-4" />
                            A Look Back
                        </div>
                        <h2 className="text-6xl font-heading font-black uppercase tracking-tighter leading-none">Memories & <span className="text-primary">Recaps</span></h2>
                    </div>
                </div>

                {pastEvents.length === 0 ? (
                    <div className="text-center py-20 opacity-50">
                        <p className="text-xl font-medium">No event memories shared yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {pastEvents.map((event: any) => (
                            <div key={event.id} className="group relative bg-card rounded-[3.5rem] overflow-hidden border border-muted shadow-sm hover:shadow-2xl transition-all duration-700">
                                <div className="flex flex-col h-full">
                                    {/* Preview Image */}
                                    <div className="relative aspect-video overflow-hidden">
                                        <img 
                                            src={event.recapImages?.[0] || event.imageUrl || "/worship_congregation.png"} 
                                            alt={event.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                                        <div className="absolute top-8 left-8">
                                            <span className="px-4 py-2 rounded-xl bg-white/90 backdrop-blur-md text-primary text-[10px] font-black uppercase tracking-widest shadow-xl">
                                                {format(new Date(event.startDate), "MMMM yyyy")}
                                            </span>
                                        </div>
                                        
                                        {/* Multi-image indicator */}
                                        {(event.recapImages?.length || 0) > 1 && (
                                            <div className="absolute bottom-8 right-8 flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-white text-[10px] font-bold">
                                                <ImageIcon className="h-3 w-3" />
                                                {(event.recapImages?.length || 0)} Photos
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-10 space-y-6">
                                        <div className="space-y-2">
                                            <h3 className="text-4xl font-heading font-black uppercase tracking-tighter leading-[0.9] group-hover:text-primary transition-colors">
                                                {event.title}
                                            </h3>
                                            <p className="text-muted-foreground text-sm font-bold italic">
                                                {event.location}
                                            </p>
                                        </div>
                                        
                                        <p className="text-muted-foreground line-clamp-3 leading-relaxed font-medium">
                                            {event.recapContent || event.description || "Relive the powerful moments from this gathering."}
                                        </p>

                                        <div className="pt-4 flex items-center justify-between">
                                            <Link href={`/events/${event.id}`} className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs group/btn">
                                                View Memories 
                                                <ArrowUpRight className="h-4 w-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
