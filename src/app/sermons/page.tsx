import { SermonsGrid } from "@/components/sermons/SermonsGrid";

export default function SermonsPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <div className="bg-muted/50 py-20 text-center">
                <div className="container px-4 md:px-6">
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl mb-4">
                        Sermons Archive
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Catch up on recent messages and grow in your faith.
                    </p>
                </div>
            </div>
            <SermonsGrid />
        </div>
    );
}
