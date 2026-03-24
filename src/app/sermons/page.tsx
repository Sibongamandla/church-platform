import { SermonsGrid } from "@/components/sermons/SermonsGrid";
import { Sparkles } from "lucide-react";
import { getSiteMedia } from "@/app/actions/content";

export const metadata = {
    title: "Messages & Wisdom | Great Nation Ministries",
};

export default async function SermonsPage() {
    const media = await getSiteMedia(["sermons_header_bg"]);
    const headerBg = media["sermons_header_bg"] || "/pastor_preaching.png";

    return (
        <div className="min-h-screen bg-background pb-32">
            {/* Cinematic Header */}
            <div className="relative py-32 md:py-48 flex flex-col items-center justify-center text-center overflow-hidden bg-neutral-950 text-white">
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-20 contrast-125 grayscale" 
                    style={{ backgroundImage: `url('${headerBg}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-background pointer-events-none" />
                
                <div className="container relative z-10 px-4 space-y-8 animate-fade-in-up">
                    <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white/70 text-xs font-black uppercase tracking-[0.4em]">
                        <Sparkles className="h-4 w-4 text-primary" />
                        Wisdom & Revelation
                    </div>
                    <h1 className="text-7xl md:text-[10rem] font-heading font-black uppercase text-white tracking-tighter leading-none">
                        The <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-amber-500 to-orange-600">Archive</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl md:text-2xl text-white/60 font-medium leading-relaxed">
                        Explore our library of transformative messages and discover the depth of God's Word for your life today.
                    </p>
                </div>
            </div>

            <section className="container px-4 md:px-6 -mt-24 relative z-20">
                <div className="bg-card border border-muted p-1 rounded-[3.5rem] shadow-2xl overflow-hidden mb-16">
                    <div className="bg-white dark:bg-neutral-900 px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-black uppercase tracking-tight">Recent Messages</h2>
                            <p className="text-muted-foreground font-medium">Sorted by most recent delivery</p>
                        </div>
                        <div className="flex items-center gap-4">
                            {/* Filter placeholders if needed */}
                            <span className="h-2 w-2 rounded-full bg-primary" />
                            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Latest Uploads</span>
                        </div>
                    </div>
                </div>

                <SermonsGrid />
            </section>
        </div>
    );
}
