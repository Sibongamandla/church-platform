import { getAllAnnouncements } from "@/lib/cache";
import { format } from "date-fns";
import { Calendar, Info, ArrowLeft, ArrowRight, Sparkles, MessageSquare } from "lucide-react";
import Link from "next/link";
import { getSiteMedia } from "@/app/actions/content";
import { cn } from "@/lib/utils";

export const metadata = {
    title: "News & Updates | Great Nation Ministries",
    description: "Stay up to date with the latest stories, announcements, and happenings at Great Nation Ministries.",
};

export default async function AnnouncementsPage() {
    const announcements = await getAllAnnouncements();
    const media = await getSiteMedia(["announcements_header_bg"]);
    const headerBg = media["announcements_header_bg"] || "/church_venue_exterior.png";

    return (
        <div className="min-h-screen bg-background pb-32">
            {/* Header Section */}
            <div className="relative py-32 md:py-48 flex flex-col items-center justify-center text-center overflow-hidden bg-neutral-900 text-white">
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay scale-110" 
                    style={{ backgroundImage: `url('${headerBg}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/80 via-transparent to-background pointer-events-none" />
                
                <div className="container relative z-10 px-4 space-y-8 animate-fade-in-up">
                    <span className="inline-block px-6 py-2 rounded-full bg-primary/20 backdrop-blur-md text-primary text-xs font-black uppercase tracking-[0.4em] border border-primary/30">
                        Stay Informed
                    </span>
                    <h1 className="text-7xl md:text-[10rem] font-heading font-black uppercase text-white tracking-tighter leading-none">
                        Our <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-600">Updates</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl md:text-2xl text-white/70 font-medium leading-relaxed">
                        The latest stories, news, and divine moments from our church family.
                    </p>
                </div>
            </div>

            <div className="container px-4 md:px-6 -mt-24 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {announcements.length === 0 ? (
                        <div className="col-span-full py-32 text-center bg-card rounded-[3rem] border border-dashed border-muted flex flex-col items-center gap-6">
                            <MessageSquare className="h-16 w-16 text-muted-foreground/30" />
                            <div className="space-y-2">
                                <h2 className="text-3xl font-heading font-black uppercase tracking-tight text-primary">No Updates Yet</h2>
                                <p className="text-muted-foreground max-w-sm mx-auto">We're currently preparing our next season of updates. Check back soon!</p>
                            </div>
                        </div>
                    ) : (
                        announcements.map((item) => (
                            <Link
                                key={item.id}
                                href={`/announcements/${item.id}`}
                                className="group flex flex-col bg-card rounded-[3rem] border border-muted hover:border-primary/30 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 overflow-hidden"
                            >
                                {item.imageUrl && (
                                    <div className="aspect-[16/10] overflow-hidden">
                                        <img 
                                            src={item.imageUrl} 
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                )}
                                <div className="p-10 flex flex-col flex-1 gap-6">
                                    <div className="flex items-center justify-between">
                                        <span className={cn(
                                            "px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                            item.category === 'Event' ? "bg-blue-500/10 text-blue-600" :
                                            item.category === 'Series' ? "bg-purple-500/10 text-purple-600" :
                                            "bg-orange-500/10 text-orange-600"
                                        )}>
                                            {item.category}
                                        </span>
                                        <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-black uppercase tracking-widest">
                                            <Calendar className="h-3 w-3" />
                                            {format(new Date(item.date), "MMM d, yyyy")}
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4 flex-1">
                                        <h2 className="text-3xl font-heading font-black uppercase tracking-tighter text-primary leading-none group-hover:text-amber-600 transition-colors">
                                            {item.title}
                                        </h2>
                                        <p className="text-muted-foreground line-clamp-3 leading-relaxed font-medium capitalize">
                                            {item.content}
                                        </p>
                                    </div>

                                    <div className="pt-6 border-t border-muted/50 flex items-center justify-between group-hover:text-primary transition-colors">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Read Story</span>
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
