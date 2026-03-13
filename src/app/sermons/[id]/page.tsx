import { VideoPlayer } from "@/components/sermons/VideoPlayer";
import { Calendar, User, ArrowLeft, Share2, Download } from "lucide-react";
import Link from "next/link";

// Mock data fetcher
async function getSermon(id: string) {
    // In a real app, fetch from CMS/database
    return {
        id,
        title: "Walking by Faith",
        series: "Hebrews",
        speaker: "Rev. David Smith",
        date: "Oct 15, 2023",
        description: "What does it mean to walk by faith and not by sight? Join us as we explore Hebrews 11 and uncover the power of a faith-filled life.",
        videoId: "dQw4w9WgXcQ", // Placeholder ID
    };
}

export default async function SermonPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const sermon = await getSermon(params.id);

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="bg-muted/50 py-12">
                <div className="container px-4 md:px-6">
                    <Link
                        href="/sermons"
                        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-6 transition-colors"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Archive
                    </Link>
                    <div className="max-w-4xl mx-auto">
                        <VideoPlayer videoId={sermon.videoId} title={sermon.title} />
                    </div>
                </div>
            </div>

            <div className="container px-4 md:px-6 mt-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                                    {sermon.series}
                                </span>
                                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl mt-1">
                                    {sermon.title}
                                </h1>
                            </div>
                            <div className="flex gap-2">
                                <button className="inline-flex items-center justify-center rounded-md border bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-muted transition-colors">
                                    <Share2 className="mr-2 h-4 w-4" />
                                    Share
                                </button>
                                <button className="inline-flex items-center justify-center rounded-md border bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-muted transition-colors">
                                    <Download className="mr-2 h-4 w-4" />
                                    Audio
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-muted-foreground border-b pb-8">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                {sermon.speaker}
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {sermon.date}
                            </div>
                        </div>
                    </div>

                    <div className="prose dark:prose-invert max-w-none">
                        <h3>About This Message</h3>
                        <p>{sermon.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
