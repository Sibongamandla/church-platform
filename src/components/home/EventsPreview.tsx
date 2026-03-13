import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCachedEvents } from "@/lib/cache";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

export async function EventsPreview() {
    const events = await getCachedEvents();

    return (
        <section className="py-24 bg-white/50">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Section Header */}
                    <div className="lg:w-1/3 space-y-8">
                        <span className="inline-block px-4 py-2 rounded-full bg-primary/5 text-primary text-sm font-bold uppercase tracking-wider">
                            Gatherings
                        </span>
                        <h2 className="text-5xl md:text-6xl font-heading font-black tracking-tighter text-primary">
                            Upcoming <br /> Events
                        </h2>
                        <p className="text-muted-foreground text-xl leading-relaxed">
                            There is always something happening. Connect to the life of the church at one of our upcoming gatherings.
                        </p>
                        <Link href="/events">
                            <Button size="lg" className="rounded-full px-8 text-lg h-14">
                                See Full Calendar
                            </Button>
                        </Link>
                    </div>

                    {/* Events List */}
                    <div className="lg:w-2/3 grid gap-6">
                        {events.length === 0 ? (
                            <div className="p-12 text-center bg-white rounded-[2rem] border border-border/40 shadow-sm">
                                <p className="text-muted-foreground text-lg">No upcoming events scheduled.</p>
                            </div>
                        ) : (
                            events.map((event) => (
                                <div
                                    key={event.id}
                                    className="group flex flex-col md:flex-row items-center gap-6 rounded-[2rem] border border-transparent bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:scale-[1.01] hover:border-border/60"
                                >
                                    <div className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-[1.5rem] bg-secondary text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                        <span className="text-sm font-bold uppercase tracking-widest">
                                            {format(new Date(event.startDate), "MMM")}
                                        </span>
                                        <span className="text-3xl font-heading font-black">
                                            {format(new Date(event.startDate), "d")}
                                        </span>
                                    </div>
                                    <div className="flex-1 space-y-2 text-center md:text-left">
                                        <h3 className="font-heading font-bold text-2xl group-hover:text-primary transition-colors">
                                            {event.title}
                                        </h3>
                                        <p className="text-muted-foreground text-lg">
                                            {format(new Date(event.startDate), "h:mm a")} • {event.location || "Main Campus"}
                                        </p>
                                    </div>
                                    <div className="hidden md:block pr-4">
                                        <div className="h-12 w-12 rounded-full border-2 border-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                                            <ArrowRight className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            )))}
                    </div>
                </div>
            </div>
        </section>
    );
}
