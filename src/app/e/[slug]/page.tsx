import { getSmartProfileBySlug } from "@/app/actions/evangelism";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Instagram, Linkedin, Twitter, MessageCircle, Share2 } from "lucide-react";

export default async function SmartProfilePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const profile = await getSmartProfileBySlug(slug);

    if (!profile) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,60,0,0.1),transparent_70%)] pointer-events-none" />

            {/* Scrolling Text Background */}
            <div className="absolute top-0 left-0 right-0 opacity-[0.03] select-none pointer-events-none overflow-hidden leading-none">
                <span className="text-[20vw] font-heading font-black uppercase text-primary whitespace-nowrap">
                    Great Nation
                </span>
            </div>

            {/* Content Container */}
            <main className="relative z-10 w-full max-w-md px-6 py-20 flex flex-col items-center text-center space-y-10 animate-fade-in-up">

                {/* Avatar Area */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-amber-600 rounded-[2.5rem] opacity-75 blur-md group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                    <div className="relative h-40 w-40 rounded-[2rem] overflow-hidden border-4 border-white bg-white shadow-xl flex items-center justify-center">
                        {profile.avatarUrl ? (
                            <img src={profile.avatarUrl} alt={profile.slug} className="h-full w-full object-cover" />
                        ) : (
                            <span className="text-5xl font-heading font-bold text-muted-foreground">
                                {(profile.member.firstName?.[0] || 'G')}{(profile.member.lastName?.[0] || 'N')}
                            </span>
                        )}
                    </div>
                </div>

                {/* Info */}
                <div className="space-y-3">
                    <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tighter uppercase text-primary">
                        {profile.member.firstName} <br /> {profile.member.lastName}
                    </h1>
                    {profile.bio && (
                        <p className="text-muted-foreground text-lg leading-relaxed max-w-xs mx-auto font-medium">
                            {profile.bio}
                        </p>
                    )}
                </div>

                {/* Main Call to Action */}
                <div className="w-full">
                    <Link
                        href={`/check-in?ref=${profile.slug}`}
                        className="flex items-center justify-center w-full h-16 rounded-full bg-primary text-primary-foreground text-lg font-heading font-bold uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        <Share2 className="mr-3 h-5 w-5" />
                        I'm Visiting / I'm New
                    </Link>
                    <p className="mt-3 text-xs text-muted-foreground font-medium uppercase tracking-widest">
                        Planning a visit? Let me know!
                    </p>
                </div>

                {/* Links Stack */}
                <div className="w-full space-y-4 pt-4">
                    {profile.whatsapp && (
                        <a
                            href={`https://wa.me/${profile.whatsapp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-full p-4 rounded-2xl bg-[#25D366] text-white font-bold hover:brightness-105 transition-transform hover:scale-[1.02] shadow-lg shadow-green-500/20"
                        >
                            <MessageCircle className="mr-2 h-6 w-6" />
                            Chat on WhatsApp
                        </a>
                    )}

                    <div className="grid grid-cols-1 gap-3">
                        {profile.instagram && (
                            <a
                                href={`https://instagram.com/${profile.instagram.replace('@', '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-full p-4 rounded-2xl bg-white border border-border/50 text-foreground font-bold hover:bg-neutral-50 transition-all hover:scale-[1.02] shadow-sm"
                            >
                                <Instagram className="mr-2 h-5 w-5 text-pink-500" />
                                Instagram
                            </a>
                        )}

                        {profile.twitter && (
                            <a
                                href={`https://twitter.com/${profile.twitter.replace('@', '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-full p-4 rounded-2xl bg-white border border-border/50 text-foreground font-bold hover:bg-neutral-50 transition-all hover:scale-[1.02] shadow-sm"
                            >
                                <Twitter className="mr-2 h-5 w-5 text-blue-400" />
                                Twitter / X
                            </a>
                        )}

                        {profile.linkedin && (
                            <a
                                href={profile.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-full p-4 rounded-2xl bg-white border border-border/50 text-foreground font-bold hover:bg-neutral-50 transition-all hover:scale-[1.02] shadow-sm"
                            >
                                <Linkedin className="mr-2 h-5 w-5 text-blue-600" />
                                LinkedIn
                            </a>
                        )}
                    </div>
                </div>

                {/* Footer / Branding */}
                <div className="mt-12 pt-12 pb-6 w-full">
                    <p className="text-xs font-heading font-bold uppercase tracking-widest text-muted-foreground/50">
                        Great Nation <span className="text-primary/40">Ministries</span>
                    </p>
                </div>
            </main>
        </div>
    );
}
