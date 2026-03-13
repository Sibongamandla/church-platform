import { MapPin, Clock } from "lucide-react";

export function ContactMap() {
    return (
        <div className="space-y-8">
            {/* Map Placeholder */}
            <div className="aspect-video w-full rounded-xl bg-muted relative overflow-hidden shadow-sm border">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-muted/50">
                    <MapPin className="h-12 w-12 mb-2 opacity-20" />
                    <span className="sr-only">Map Location</span>
                </div>
                {/* In production, embed Google Maps iframe here */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <p className="text-sm font-medium text-muted-foreground">
                        Google Maps Embed Placeholder
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-start gap-4">
                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-foreground">Visit Us</h3>
                        <p className="text-muted-foreground mt-1">
                            123 Church Avenue
                            <br />
                            Cityville, ST 12345
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Clock className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-foreground">Service Times</h3>
                        <div className="mt-1 space-y-1 text-muted-foreground">
                            <p>
                                <span className="font-medium text-foreground">Sundays:</span> 9:00 AM & 11:00 AM
                            </p>
                            <p>
                                <span className="font-medium text-foreground">Wednesdays:</span> 7:00 PM (Youth & Midweek)
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
