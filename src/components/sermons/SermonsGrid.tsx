import { prisma } from "@/lib/prisma";
import { SermonCard } from "./SermonCard";
import { format } from "date-fns";

export async function SermonsGrid() {
    const sermons = await (prisma as any).sermon.findMany({
        orderBy: { date: "desc" },
    });

    if (sermons.length === 0) {
        return (
            <section className="py-20 text-center">
                <p className="text-muted-foreground">No sermons have been published yet. Check back soon!</p>
            </section>
        );
    }

    return (
        <section className="py-20">
            <div className="container px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {sermons.map((sermon: any) => (
                        <SermonCard
                            key={sermon.id}
                            sermon={{
                                id: sermon.id,
                                title: sermon.title,
                                series: sermon.series ?? "Stand Alone",
                                speaker: sermon.speaker,
                                date: format(new Date(sermon.date), "MMM d, yyyy"),
                                thumbnail: sermon.thumbnailUrl ?? "/pastor_preaching.png",
                                slug: sermon.id,
                                videoUrl: sermon.videoUrl,
                                highlightQuote: sermon.highlightQuote,
                            }}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
