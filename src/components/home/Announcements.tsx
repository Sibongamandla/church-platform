import { Calendar, Info, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getCachedAnnouncements } from "@/lib/cache";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

export async function Announcements() {
    const announcements = await getCachedAnnouncements();

    return (
        <section className="py-32 bg-muted/20 overflow-hidden">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col lg:flex-row gap-20 items-start">
                    
                    {/* Section Header */}
                    <div className="lg:w-2/5 space-y-10 lg:sticky lg:top-32">
                        <div className="space-y-4">
                            <span className="inline-block px-4 py-2 rounded-full bg-primary/5 text-primary text-xs font-black uppercase tracking-[0.2em]">
                                Stay Informed
                            </span>
                            <h2 className="text-6xl md:text-7xl font-heading font-black tracking-tighter text-primary uppercase leading-tight">
                                Happening <br /> 
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600 text-4xl md:text-5xl">at Great Nation Ministries</span>
                            </h2>
                        </div>
                        <p className="text-muted-foreground text-xl leading-relaxed max-w-md font-medium">
                            Stay up to date with the latest news, series updates, and important announcements from our church family.
                        </p>
                        <div className="pt-4">
                            <Link href="/announcements">
                                <Button variant="outline" size="lg" className="rounded-2xl px-10 text-lg h-16 font-black uppercase tracking-widest border-2">
                                    View All Updates
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Announcements List */}
                    <div className="lg:w-3/5 w-full space-y-8">
                        {announcements.length === 0 ? (
                            <div className="p-20 text-center bg-background/50 rounded-[3rem] border-2 border-dashed border-muted flex flex-col items-center gap-6">
                                <Info className="h-12 w-12 text-muted-foreground/50" />
                                <p className="text-muted-foreground text-xl font-medium tracking-tight">No announcements at the moment. Check back soon!</p>
                            </div>
                        ) : (
                            <div className="grid gap-6">
                                {announcements.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={`/announcements/${item.id}`}
                                        className="group relative block bg-white dark:bg-neutral-900 rounded-[2.5rem] border border-muted dark:border-white/5 p-8 shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                                    >
                                        <div className="relative z-10 flex flex-col gap-6">
                                            <div className="flex justify-between items-start">
                                                <span className={cn(
                                                    "inline-flex items-center rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-widest transition-colors",
                                                    item.category === 'Event' ? "bg-blue-500/10 text-blue-600" :
                                                        item.category === 'Series' ? "bg-purple-500/10 text-purple-600" :
                                                            "bg-orange-500/10 text-orange-600"
                                                )}>
                                                    {item.category}
                                                </span>
                                                <div className="flex items-center text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                                    <Calendar className="mr-2 h-3 w-3" />
                                                    {format(new Date(item.date), "MMM d, yyyy")}
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <h3 className="font-heading font-black text-3xl uppercase tracking-tighter group-hover:text-primary transition-colors leading-tight">
                                                    {item.title}
                                                </h3>
                                                <p className="text-muted-foreground line-clamp-2 text-lg font-medium leading-relaxed">
                                                    {item.content}
                                                </p>
                                            </div>

                                            <div className="flex items-center text-primary font-black uppercase tracking-widest text-xs gap-2 group-hover:gap-4 transition-all">
                                                Read More <ArrowRight className="h-4 w-4" />
                                            </div>
                                        </div>

                                        {/* Hover Effect Background */}
                                        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-32 w-32 rounded-full bg-primary/5 group-hover:scale-[5] transition-transform duration-1000" />
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
