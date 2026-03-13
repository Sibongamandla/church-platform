import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import Marquee from "@/components/ui/marquee";

export function HeroSection() {
    return (
        <section className="relative min-h-screen pt-20 flex flex-col items-center justify-center overflow-hidden bg-background">

            {/* Background Marquee - Massive Text */}
            <div className="absolute inset-x-0 top-1/4 -z-10 opacity-[0.03] select-none pointer-events-none">
                <Marquee className="[--duration:20s]" repeat={2}>
                    <span className="text-[20vw] font-heading font-black leading-none uppercase">
                        Welcome Home &nbsp;
                    </span>
                </Marquee>
            </div>

            <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center text-center space-y-10">

                {/* Main Heading */}
                <div className="space-y-4 animate-fade-in-up">
                    <h1 className="text-6xl md:text-9xl font-heading font-black tracking-tighter uppercase leading-[0.9] text-primary">
                        Welcome <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-tr from-orange-500 to-amber-500">Home</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl md:text-2xl text-muted-foreground font-medium">
                        A place to belong, believe, and become.
                    </p>
                </div>

                {/* Hero Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md mx-auto animate-fade-in-up delay-100">
                    <Link href="/check-in" className="w-full">
                        <Button className="w-full h-14 rounded-full text-lg font-bold shadow-xl shadow-primary/20">
                            Plan Your Visit
                        </Button>
                    </Link>
                    <Link href="/sermons" className="w-full">
                        <Button variant="outline" className="w-full h-14 rounded-full text-lg border-2 bg-background/50 backdrop-blur-sm">
                            <Play className="mr-2 h-5 w-5 fill-current" />
                            Watch Online
                        </Button>
                    </Link>
                </div>

                {/* Hero Image / Mask */}
                <div className="relative w-full max-w-5xl mt-12 aspect-[16/9] md:aspect-[2.4/1] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white animate-fade-in-up delay-200 group">
                    <div className="absolute inset-0 bg-neutral-900/10 group-hover:bg-transparent transition-colors duration-500 z-10" />

                    {/* Placeholder for Video/Image */}
                    <div className="absolute inset-0 bg-neutral-200 flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2673&auto=format&fit=crop')] bg-cover bg-center">
                        {/* <video src="..." autoPlay loop muted className="w-full h-full object-cover" /> */}
                    </div>

                    {/* Floating Badge */}
                    <div className="absolute bottom-8 right-8 z-20 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl hidden md:block">
                        <div className="text-left">
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Next Service</p>
                            <p className="text-2xl font-heading font-bold text-primary">Sunday 9:00 AM</p>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
