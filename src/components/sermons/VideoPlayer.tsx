interface VideoPlayerProps {
    videoId?: string; // YouTube ID
    videoUrl?: string; // Direct URL
    title: string;
}

export function VideoPlayer({ videoId, videoUrl, title }: VideoPlayerProps) {
    if (videoId) {
        return (
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black shadow-lg">
                <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full border-0"
                />
            </div>
        );
    }

    if (videoUrl) {
        return (
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black shadow-lg">
                <video controls className="h-full w-full" poster="/poster-placeholder.jpg">
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
        );
    }

    // Fallback
    return (
        <div className="relative aspect-video w-full flex items-center justify-center bg-gray-900 text-white rounded-xl">
            <p>Video not available</p>
        </div>
    );
}
