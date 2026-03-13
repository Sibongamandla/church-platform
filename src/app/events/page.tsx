import { getAllUpcomingEvents } from "@/lib/cache";
import { format } from "date-fns";
import { Calendar, MapPin, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
    title: "Events",
};

export default async function EventsPage() {
    const events = await getAllUpcomingEvents();

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header Section */}
            <div className="relative py-24 md:py-32 flex flex-col items-center justify-center text-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
                <div className="container relative z-10 px-4 space-y-6 animate-fade-in-up">
                    <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-widest">
                        Fellowship & Gathering
                    </span>
                    <h1 className="text-5xl md:text-7xl font-heading font-black uppercase text-primary tracking-tighter">
                        Upcoming <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-600">Events</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-muted-foreground">
                        Join us as we gather to worship, learn, and serve together. There is a place for you here.
                    </p>
                </div>
            </div>

            {/* Events Grid */}
            <div className="container px-4 md:px-6">
                {events.length === 0 ? (
                    <div className="w-full max-w-lg mx-auto p-12 text-center bg-card rounded-[2rem] border border-border shadow-sm">
                        <div className="mb-6 mx-auto h-16 w-16 bg-muted rounded-full flex items-center justify-center">
                            <Calendar className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-2xl font-bold font-heading text-primary mb-2">No Upcoming Events</h3>
                        <p className="text-muted-foreground">
                            We are currently planning our next season of gatherings. Check back soon!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.map((event) => (
                            <div
                                key={event.id}
                                className="group flex flex-col justify-between rounded-[2rem] border border-border/50 bg-card hover:border-primary/20 p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="space-y-6">
                                    {/* Date Badge */}
                                    <div className="flex items-start justify-between">
                                        <div className="flex flex-col items-center justify-center h-20 w-20 rounded-[1.5rem] bg-secondary text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 shadow-sm">
                                            <span className="text-xs font-bold uppercase tracking-widest opacity-80">
                                                {format(new Date(event.startDate), "MMM")}
                                            </span>
                                            <span className="text-3xl font-heading font-black leading-none">
                                                {format(new Date(event.startDate), "d")}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-3">
                                        <h3 className="text-2xl font-heading font-bold text-primary group-hover:text-amber-600 transition-colors line-clamp-2">
                                            {event.title}
                                        </h3>
                                        <div className="flex flex-col gap-2 text-muted-foreground text-sm font-medium">
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-amber-500" />
                                                {format(new Date(event.startDate), "h:mm a")} - {format(new Date(event.endDate), "h:mm a")}
                                            </div>
                                            {event.location && (
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-amber-500" />
                                                    {event.location}
                                                </div>
                                            )}
                                        </div>
                                        {event.description && (
                                            <p className="text-muted-foreground line-clamp-3 leading-relaxed pt-2">
                                                {event.description}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Footer / Action */}
                                <div className="mt-8 pt-6 border-t border-border/40">
                                    <Link href="/check-in" className="w-full">
                                        <Button variant="outline" className="w-full rounded-full font-bold border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all">
                                            Register / Check-in
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
