import { prisma } from "@/lib/prisma";
import { SermonCard } from "./SermonCard";

export async function SermonsGrid() {
    const sermons = await prisma.sermon.findMany({
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
        <section className="py-12">
            <div className="container px-4 md:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {sermons.map((sermon) => (
                        <SermonCard
                            key={sermon.id}
                            sermon={{
                                id: sermon.id,
                                title: sermon.title,
                                series: sermon.series ?? "Stand Alone",
                                speaker: sermon.speaker,
                                date: sermon.date.toLocaleDateString("en-ZA", { year: "numeric", month: "short", day: "numeric" }),
                                thumbnail: sermon.thumbnailUrl ?? "/thumbnails/default.jpg",
                                slug: sermon.id,
                                videoUrl: sermon.videoUrl,
                            }}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
