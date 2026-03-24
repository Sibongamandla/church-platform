import { getAnnouncementById } from "@/lib/cache";
import { format } from "date-fns";
import { Calendar, ArrowLeft, Share2, Sparkles, MessageSquare } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const item = await getAnnouncementById(id);
    if (!item) return { title: "Not Found" };
    return {
        title: `${item.title} | Great Nation Ministries`,
        description: item.content.slice(0, 160),
    };
}

export default async function AnnouncementDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const item = await getAnnouncementById(id);

    if (!item) notFound();

    return (
        <div className="min-h-screen bg-background pb-32">
            {/* Hero / Header */}
            <div className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-black">
                     <img 
                        src={item.imageUrl || "/church_venue_exterior.png"} 
                        alt={item.title}
                        className="w-full h-full object-cover opacity-60 scale-105"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                
                <div className="container relative z-10 px-4 pt-20">
                    <Link 
                        href="/announcements" 
                        className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8 font-bold uppercase tracking-widest text-xs group"
                    >
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        All Updates
                    </Link>
                    
                    <div className="max-w-4xl space-y-6 animate-fade-in-up">
                        <div className="flex items-center gap-3">
                            <span className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest shadow-2xl">
                                {item.category}
                            </span>
                            <span className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest border border-white/20">
                                {format(new Date(item.date), "MMMM d, yyyy")}
                            </span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-heading font-black text-white uppercase tracking-tighter leading-none">
                            {item.title}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="container px-4 md:px-6 -mt-10 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-16">
                        <div className="prose prose-xl prose-neutral dark:prose-invert max-w-none">
                            <div className="flex items-center gap-3 text-primary mb-10">
                                <Sparkles className="h-6 w-6" />
                                <h2 className="text-2xl font-black uppercase tracking-tight m-0">The Full Story</h2>
                            </div>
                            <div className="text-xl text-muted-foreground leading-relaxed font-medium whitespace-pre-wrap">
                                {item.content}
                            </div>
                        </div>

                        {/* Additional content could go here in a real scenario */}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        <div className="bg-card border border-muted p-10 rounded-[3rem] shadow-xl space-y-8 sticky top-32">
                            <h3 className="text-xl font-black uppercase tracking-widest text-primary border-b border-muted pb-4">Information</h3>
                            
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                        <Calendar className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Published</p>
                                        <p className="font-bold text-lg">{format(new Date(item.date), "MMMM d, yyyy")}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                        <MessageSquare className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Category</p>
                                        <p className="font-bold text-lg">{item.category}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button variant="outline" className="w-full h-16 rounded-2xl font-bold border-2">
                                    <Share2 className="mr-2 h-5 w-5" />
                                    Share Update
                                </Button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
