"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Play, Calendar as CalendarIcon, Clock, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Marquee from "@/components/ui/marquee";
import { cn } from "@/lib/utils";

const DEFAULT_SLIDES = [
    {
        imageUrl: "/church_venue_exterior.png",
        subtitle: "A Place of Worship",
        title: "Welcome Home",
        description: "Join our vibrant community as we grow in faith and love together."
    },
    {
        imageUrl: "/worship_congregation.png",
        subtitle: "Faith in Action",
        title: "Be the Change",
        description: "Experience the power of community in our weekly gatherings."
    },
    {
        imageUrl: "/pastor_preaching.png",
        subtitle: "Empowering Message",
        title: "Grow in Grace",
        description: "Hear transformative messages that will inspire your spiritual journey."
    }
];

export function HeroSection({ initialSlides = [] }: { initialSlides?: any[] }) {
    const slides = initialSlides.length > 0 ? initialSlides : DEFAULT_SLIDES;
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 8000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    // Dynamic paths for generated images - use the full path from the artifact dir
    // Since images are in brain/, I'll need to move them to public/ or use the correct relative path if possible.
    // Actually, for a demo, I'll use the ones I just generated. I'll move them to public/ first.

    return (
        <section className="relative min-h-[90vh] md:min-h-screen pt-20 flex flex-col items-center justify-center overflow-hidden bg-background">

            {/* Background Marquee - Massive Text */}
            <div className="absolute inset-x-0 top-1/4 -z-10 opacity-[0.02] select-none pointer-events-none">
                <Marquee className="[--duration:30s]" repeat={2}>
                    <span className="text-[25vw] font-heading font-black leading-none uppercase">
                        Great Nation Ministries &nbsp;
                    </span>
                </Marquee>
            </div>

            <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center text-center space-y-12">

                {/* Main Heading & Content */}
                <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-[0.2em] mb-4">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        Live Service Every Sunday
                    </div>
                    <h1 className="text-6xl md:text-9xl font-heading font-black tracking-tighter uppercase leading-[0.85] text-primary">
                        {slides[currentSlide].title.split(' ')[0]} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-tr from-amber-500 via-orange-500 to-red-600">
                            {slides[currentSlide].title.split(' ')[1]}
                        </span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed">
                        {slides[currentSlide].description || slides[currentSlide].subtitle}
                    </p>
                </div>

                {/* Hero Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md mx-auto animate-fade-in-up delay-100">
                    <Link href="/check-in" className="w-full">
                        <Button className="w-full h-16 rounded-2xl text-lg font-black uppercase tracking-widest shadow-2xl shadow-primary/30 group">
                            Plan Your Visit
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                    <Link href="/sermons" className="w-full">
                        <Button variant="outline" className="w-full h-16 rounded-2xl text-lg font-bold border-2 bg-background/50 backdrop-blur-md hover:bg-muted/50 transition-all">
                            <Play className="mr-2 h-5 w-5 fill-current text-primary" />
                            Watch Online
                        </Button>
                    </Link>
                </div>

                {/* Premium Carousel / Modal-like View */}
                <div className="relative w-full max-w-6xl mt-8 animate-fade-in-up delay-200">
                    <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.1)] border-8 border-white dark:border-white/5">
                        {slides.map((slide, index) => (
                            <div
                                key={slide.image}
                                className={cn(
                                    "absolute inset-0 transition-all duration-1000 ease-in-out transform",
                                    index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-110 pointer-events-none"
                                )}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                                <img
                                    src={slides[index].imageUrl}
                                    alt={slide.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-10 left-10 right-10 z-20 text-white text-left hidden md:block">
                                    <span className="text-xs font-bold uppercase tracking-[0.3em] opacity-80 mb-2 block">{slide.subtitle}</span>
                                    <h3 className="text-4xl font-heading font-black uppercase tracking-tight">{slide.title}</h3>
                                </div>
                            </div>
                        ))}

                        {/* Slide Navigation */}
                        <div className="absolute bottom-10 right-10 z-30 flex gap-2">
                            <button
                                onClick={prevSlide}
                                className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
                            >
                                <ChevronLeft className="h-6 w-6" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
                            >
                                <ChevronRight className="h-6 w-6" />
                            </button>
                        </div>
                    </div>

                    {/* Service Info Floating Badge */}
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white dark:bg-neutral-900 px-10 py-6 rounded-[2rem] shadow-2xl flex items-center gap-8 border border-muted dark:border-white/10 whitespace-nowrap">
                        <div className="flex items-center gap-4 border-r pr-8">
                            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                <CalendarIcon className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Main Service</p>
                                <p className="font-heading font-bold text-lg">Sunday</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                                <Clock className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Starts At</p>
                                <p className="font-heading font-bold text-lg">09:00 AM</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
