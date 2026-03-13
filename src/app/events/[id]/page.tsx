import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { Calendar, MapPin, ArrowLeft, Image as ImageIcon, Sparkles, Share2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function EventDetailPage({ params }: { params: { id: string } }) {
    const rawEvent = await prisma.event.findUnique({
        where: { id: params.id },
    });

    if (!rawEvent) notFound();
    const event = rawEvent as any;

    const isPast = new Date(event.startDate) < new Date();

    return (
        <div className="min-h-screen bg-background pb-32">
            {/* Header / Hero */}
            <div className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-black">
                     <img 
                        src={event.recapImages?.[0] || event.imageUrl || "/church_venue_exterior.png"} 
                        alt={event.title}
                        className="w-full h-full object-cover opacity-60 scale-105"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                
                <div className="container relative z-10 px-4 pt-20">
                    <Link 
                        href="/events" 
                        className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8 font-bold uppercase tracking-widest text-xs group"
                    >
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Events
                    </Link>
                    
                    <div className="max-w-4xl space-y-6 animate-fade-in-up">
                        <div className="flex items-center gap-3">
                            <span className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest shadow-2xl">
                                {isPast ? "Memories & Recap" : "Upcoming Gathering"}
                            </span>
                            <span className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest border border-white/20">
                                {format(new Date(event.startDate), "MMMM d, yyyy")}
                            </span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-heading font-black text-white uppercase tracking-tighter leading-none">
                            {event.title}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="container px-4 md:px-6 -mt-10 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-16">
                        <div className="prose prose-xl prose-neutral dark:prose-invert max-w-none">
                            <div className="flex items-center gap-3 text-primary mb-6">
                                <Sparkles className="h-6 w-6" />
                                <h2 className="text-2xl font-black uppercase tracking-tight m-0">The Experience</h2>
                            </div>
                            <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                                {event.recapContent || event.description || "Relive the powerful moments from this gathering."}
                            </p>
                        </div>

                        {/* Photo Gallery */}
                        {(event.recapImages?.length || 0) > 0 && (
                            <div className="space-y-8">
                                <div className="flex items-center justify-between border-b border-muted pb-6">
                                    <div className="flex items-center gap-3">
                                        <ImageIcon className="h-6 w-6 text-primary" />
                                        <h2 className="text-2xl font-black uppercase tracking-tight">Photo Gallery</h2>
                                    </div>
                                    <span className="text-muted-foreground text-sm font-bold">{event.recapImages.length} Photos</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {event.recapImages.map((img: string, idx: number) => (
                                        <div 
                                            key={idx} 
                                            className={cn(
                                                "relative rounded-[2rem] overflow-hidden group shadow-lg transition-all duration-700",
                                                idx % 3 === 0 ? "md:col-span-2 aspect-[21/9]" : "aspect-square"
                                            )}
                                        >
                                            <img 
                                                src={img} 
                                                alt={`Memory ${idx + 1}`} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                                            />
                                            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity mix-blend-overlay" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar / Info */}
                    <div className="space-y-8">
                        <div className="bg-card border border-muted p-10 rounded-[3rem] shadow-xl space-y-8 sticky top-32">
                            <h3 className="text-xl font-black uppercase tracking-widest text-primary border-b border-muted pb-4">Details</h3>
                            
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                        <Calendar className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Date</p>
                                        <p className="font-bold text-lg">{format(new Date(event.startDate), "EEEE, MMM d")}</p>
                                    </div>
                                </div>

                                {event.location && (
                                    <div className="flex items-start gap-4">
                                        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                            <MapPin className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Location</p>
                                            <p className="font-bold text-lg">{event.location}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 space-y-4">
                                {!isPast && (
                                    <Link href="/check-in" className="w-full">
                                        <Button className="w-full h-16 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20">
                                            Plan Your Visit
                                        </Button>
                                    </Link>
                                )}
                                <Button variant="outline" className="w-full h-16 rounded-2xl font-bold border-2">
                                    <Share2 className="mr-2 h-5 w-5" />
                                    Share Memories
                                </Button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
