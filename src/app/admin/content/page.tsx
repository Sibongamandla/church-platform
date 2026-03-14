import { prisma } from "@/lib/prisma";
import { SlideManager } from "./SlideManager";

export default async function ContentManagementPage() {
    const slides = await prisma.homeSlide.findMany({
        orderBy: { order: "asc" }
    });

    return (
        <div className="max-w-7xl mx-auto p-8 space-y-12">
            <div>
                <h1 className="text-4xl font-bold tracking-tight">Content Management</h1>
                <p className="text-muted-foreground mt-1">Manage dynamic content for the frontend website</p>
            </div>

            <SlideManager initialSlides={slides} />
            
            <div className="pt-8 border-t">
                <h2 className="text-2xl font-bold mb-4">Content Guidelines</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-muted/50 rounded-lg border">
                        <h4 className="font-bold mb-2">Image Aspect Ratio</h4>
                        <p className="text-sm text-muted-foreground">For hero slides, use images with a 16:9 or 21:9 aspect ratio for the best visual experience.</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg border">
                        <h4 className="font-bold mb-2">Typography</h4>
                        <p className="text-sm text-muted-foreground">Keep titles short and punchy. Subtitles should provide context but stay under 100 characters.</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg border">
                        <h4 className="font-bold mb-2">Performance</h4>
                        <p className="text-sm text-muted-foreground">Optimize images before uploading to ensure fast page loads for all users.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
