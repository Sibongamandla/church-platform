import { Calendar, Info } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getCachedAnnouncements } from "@/lib/cache";
import { format } from "date-fns";

export async function Announcements() {
    const announcements = await getCachedAnnouncements();

    return (
        <section className="py-20 bg-muted/20">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                            Happening at Grace
                        </h2>
                        <p className="text-muted-foreground mt-2">
                            Stay up to date with the latest news and announcements.
                        </p>
                    </div>
                    <Link
                        href="/announcements"
                        className="text-primary font-medium hover:underline flex items-center gap-2"
                    >
                        View all updates <Info className="h-4 w-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {announcements.length === 0 ? (
                        <div className="col-span-3 text-center py-12 text-muted-foreground">
                            No announcements at the moment.
                        </div>
                    ) : (
                        announcements.map((item) => (
                            <Link
                                key={item.id}
                                href={`/announcements/${item.id}`}
                                className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-border/50 bg-card p-8 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
                            >
                                <div className="space-y-6">
                                    <span className={cn(
                                        "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors",
                                        item.category === 'Event' ? "bg-blue-50 text-blue-700" :
                                            item.category === 'Series' ? "bg-purple-50 text-purple-700" :
                                                "bg-orange-50 text-orange-700"
                                    )}>
                                        {item.category}
                                    </span>
                                    <h3 className="font-heading font-bold text-2xl leading-tight text-primary group-hover:text-amber-600 transition-colors">
                                        {item.title}
                                    </h3>
                                    <div className="text-base text-muted-foreground line-clamp-3">
                                        {item.content}
                                    </div>
                                </div>
                                <div className="mt-8 flex items-center text-sm font-medium text-muted-foreground border-t border-border/50 pt-4">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    {format(new Date(item.date), "MMMM d, yyyy")}
                                </div>
                            </Link>
                        )))}
                </div>
            </div>
        </section>
    );
}
