import { format } from "date-fns";
import { Image as ImageIcon, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface RecapEvent {
    id: string;
    title: string;
    startDate: Date | string;
    recapImages: string[];
    recapContent?: string | null;
}

interface RecapsPreviewProps {
    recaps: any[];
}

export function RecapsPreview({ recaps }: RecapsPreviewProps) {
    if (recaps.length === 0) return null;

    return (
        <section className="py-32 bg-background overflow-hidden">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="space-y-4 max-w-2xl">
                        <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-xs">
                            <Sparkles className="h-4 w-4" />
                            Relive the Moments
                        </div>
                        <h2 className="text-5xl md:text-7xl font-heading font-black uppercase tracking-tighter leading-[0.9]">
                            Recent <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">Memories</span>
                        </h2>
                        <p className="text-xl text-muted-foreground font-medium">
                            Every gathering is a story of God's grace. Take a look back at what He has done in our community.
                        </p>
                    </div>
                    <Link href="/events">
                        <Button variant="outline" className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all group">
                            Explore All
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
                    {/* Main Featured Recap */}
                    {recaps[0] && (
                        <div className="md:col-span-8 group relative aspect-[16/10] md:aspect-auto md:h-[600px] rounded-[3rem] overflow-hidden shadow-2xl border border-muted">
                            <img 
                                src={recaps[0].recapImages?.[0] || "/church_venue_exterior.png"} 
                                alt={recaps[0].title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                            <div className="absolute bottom-0 left-0 p-8 md:p-12 space-y-4 w-full">
                                <div className="flex items-center gap-3">
                                    <span className="px-4 py-1.5 rounded-full bg-primary/20 backdrop-blur-md text-primary text-[10px] font-black uppercase tracking-widest border border-primary/30">
                                        {format(new Date(recaps[0].startDate), "MMMM yyyy")}
                                    </span>
                                </div>
                                <h3 className="text-3xl md:text-5xl font-heading font-black text-white uppercase tracking-tighter leading-none">
                                    {recaps[0].title}
                                </h3>
                                <Link 
                                    href={`/events/${recaps[0].id}`}
                                    className="inline-flex items-center text-white/70 hover:text-white font-bold uppercase tracking-widest text-xs transition-colors group/link"
                                >
                                    Read the story 
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Side Recaps */}
                    <div className="md:col-span-4 flex flex-col gap-6 md:gap-8">
                        {recaps.slice(1, 3).map((recap, idx) => (
                            <div key={recap.id} className="flex-1 group relative rounded-[2.5rem] overflow-hidden shadow-xl border border-muted min-h-[250px]">
                                <img 
                                    src={recap.recapImages?.[0] || "/church_venue_exterior.png"} 
                                    alt={recap.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                                <div className="absolute bottom-0 left-0 p-8 space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/60">
                                        {format(new Date(recap.startDate), "MMM d, yyyy")}
                                    </p>
                                    <h3 className="text-xl md:text-2xl font-heading font-black text-white uppercase tracking-tighter leading-tight">
                                        {recap.title}
                                    </h3>
                                    <Link 
                                        href={`/events/${recap.id}`}
                                        className="inline-flex items-center text-primary font-bold uppercase tracking-widest text-[10px] hover:text-primary/80 transition-colors"
                                    >
                                        View Gallery
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
