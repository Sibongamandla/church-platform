import { SermonCard } from "./SermonCard";

// Mock data
const sermons = [
    {
        id: 1,
        title: "Walking by Faith",
        series: "Hebrews",
        speaker: "Rev. David Smith",
        date: "Oct 15, 2023",
        thumbnail: "/thumbnails/hebrews-1.jpg",
        slug: "walking-by-faith",
    },
    {
        id: 2,
        title: "The Power of Prayer",
        series: "Stand Alone",
        speaker: "Sarah Johnson",
        date: "Oct 8, 2023",
        thumbnail: "/thumbnails/prayer.jpg",
        slug: "power-of-prayer",
    },
    {
        id: 3,
        title: "Community in Action",
        series: "Life Together",
        speaker: "Rev. David Smith",
        date: "Oct 1, 2023",
        thumbnail: "/thumbnails/community.jpg",
        slug: "community-in-action",
    },
    {
        id: 4,
        title: "Grace Upon Grace",
        series: "Gospel of John",
        speaker: "Michael Chen",
        date: "Sep 24, 2023",
        thumbnail: "/thumbnails/grace.jpg",
        slug: "grace-upon-grace",
    },
];

export function SermonsGrid() {
    return (
        <section className="py-12">
            <div className="container px-4 md:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {sermons.map((sermon) => (
                        <SermonCard key={sermon.id} sermon={sermon} />
                    ))}
                </div>
            </div>
        </section>
    );
}
