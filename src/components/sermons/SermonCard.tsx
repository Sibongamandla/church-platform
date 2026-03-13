import Link from "next/link";
import { PlayCircle, Calendar, User } from "lucide-react";

interface SermonProps {
    id: number;
    title: string;
    series: string;
    speaker: string;
    date: string;
    thumbnail: string;
    slug: string;
}

export function SermonCard({ sermon }: { sermon: SermonProps }) {
    return (
        <div className="group relative overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md">
            <div className="aspect-video relative bg-muted overflow-hidden">
                {/* Placeholder for Image */}
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800 text-muted-foreground">
                    Thumbnail: {sermon.title}
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <PlayCircle className="h-12 w-12 text-white drop-shadow-lg" />
                </div>
            </div>
            <div className="p-4 space-y-3">
                <div>
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                        {sermon.series}
                    </span>
                    <h3 className="font-bold text-lg leading-tight mt-1 line-clamp-2 group-hover:text-primary transition-colors">
                        {sermon.title}
                    </h3>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {sermon.speaker}
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {sermon.date}
                    </div>
                </div>
            </div>
            <Link href={`/sermons/${sermon.id}`} className="absolute inset-0">
                <span className="sr-only">Watch {sermon.title}</span>
            </Link>
        </div>
    );
}
