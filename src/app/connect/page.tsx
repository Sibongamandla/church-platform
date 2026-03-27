import { Facebook, Instagram, Youtube, MessageCircle, Phone, Mail, MapPin, Send, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ConnectPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 bg-primary overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[url('/worship_congregation.png')] bg-cover bg-center" />
                </div>
                <div className="container relative z-10 px-4 md:px-6 text-center text-primary-foreground">
                    <span className="inline-block px-4 py-2 rounded-full bg-white/10 text-white text-xs font-black uppercase tracking-[0.2em] mb-6">
                        We're Glad You're Here
                    </span>
                    <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter uppercase mb-6">
                        Connect <span className="text-amber-400 font-bold">With Us</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl opacity-90 font-medium">
                        Whether you're new or have been with us for years, we want to hear from you. 
                        Join our community and grow with us.
                    </p>
                </div>
            </section>

            <section className="py-24 bg-background">
                <div className="container px-4 md:px-6">
                    <div className="grid lg:grid-cols-2 gap-20 items-start">
                        
                        {/* Left Side: Socials & WhatsApp */}
                        <div className="space-y-16">
                            {/* Social Media */}
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <h2 className="text-4xl font-heading font-black uppercase tracking-tight text-primary">
                                        Follow Our Journey
                                    </h2>
                                    <p className="text-muted-foreground text-lg">
                                        Stay connected throughout the week on our social platforms.
                                    </p>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <a href="#" className="flex flex-col items-center justify-center p-8 rounded-[2rem] bg-secondary/50 border border-muted hover:border-primary/30 hover:bg-white dark:hover:bg-neutral-900 transition-all group">
                                        <Facebook className="h-10 w-10 text-blue-600 mb-4 group-hover:scale-110 transition-transform" />
                                        <span className="font-bold uppercase tracking-widest text-xs">Facebook</span>
                                    </a>
                                    <a href="#" className="flex flex-col items-center justify-center p-8 rounded-[2rem] bg-secondary/50 border border-muted hover:border-primary/30 hover:bg-white dark:hover:bg-neutral-900 transition-all group">
                                        <Instagram className="h-10 w-10 text-pink-600 mb-4 group-hover:scale-110 transition-transform" />
                                        <span className="font-bold uppercase tracking-widest text-xs">Instagram</span>
                                    </a>
                                    <a href="#" className="flex flex-col items-center justify-center p-8 rounded-[2rem] bg-secondary/50 border border-muted hover:border-primary/30 hover:bg-white dark:hover:bg-neutral-900 transition-all group">
                                        <Youtube className="h-10 w-10 text-red-600 mb-4 group-hover:scale-110 transition-transform" />
                                        <span className="font-bold uppercase tracking-widest text-xs">YouTube</span>
                                    </a>
                                </div>
                            </div>

                            {/* WhatsApp Groups */}
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <h2 className="text-4xl font-heading font-black uppercase tracking-tight text-primary">
                                        WhatsApp Community
                                    </h2>
                                    <p className="text-muted-foreground text-lg">
                                        Join our official WhatsApp groups for immediate updates and fellowship.
                                    </p>
                                </div>
                                
                                <div className="space-y-4">
                                    <a href="#" className="flex items-center justify-between p-6 rounded-3xl bg-[#25D366]/5 border border-[#25D366]/20 hover:bg-[#25D366]/10 transition-all group">
                                        <div className="flex items-center gap-6">
                                            <div className="h-14 w-14 rounded-2xl bg-[#25D366] flex items-center justify-center text-white">
                                                <MessageCircle className="h-8 w-8" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-xl">Main Announcement Group</h3>
                                                <p className="text-sm text-muted-foreground">General church news and updates</p>
                                            </div>
                                        </div>
                                        <ArrowRight className="h-6 w-6 text-[#25D366] group-hover:translate-x-2 transition-transform" />
                                    </a>
                                    <a href="#" className="flex items-center justify-between p-6 rounded-3xl bg-[#25D366]/5 border border-[#25D366]/20 hover:bg-[#25D366]/10 transition-all group">
                                        <div className="flex items-center gap-6">
                                            <div className="h-14 w-14 rounded-2xl bg-[#25D366] flex items-center justify-center text-white">
                                                <MessageCircle className="h-8 w-8" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-xl">Prayer & Intercession</h3>
                                                <p className="text-sm text-muted-foreground">Submit prayer requests and join in prayer</p>
                                            </div>
                                        </div>
                                        <ArrowRight className="h-6 w-6 text-[#25D366] group-hover:translate-x-2 transition-transform" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Reach Out Form */}
                        <div className="bg-white dark:bg-neutral-900 rounded-[3rem] p-10 md:p-14 shadow-2xl border border-muted dark:border-white/5 space-y-10 lg:sticky lg:top-32">
                            <div className="space-y-4">
                                <h2 className="text-4xl font-heading font-black uppercase tracking-tight text-primary leading-none">
                                    Reach Out <br /> 
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">To Us</span>
                                </h2>
                                <p className="text-muted-foreground text-lg font-medium">
                                    Need prayer, a visit, or just want to talk? Fill out the form below and an evangelist or team member will reach out.
                                </p>
                            </div>

                            <form className="space-y-6">
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest ml-1">Full Name</label>
                                        <Input placeholder="John Doe" className="h-14 rounded-2xl bg-secondary/50 border-none focus-visible:ring-primary" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest ml-1">Phone Number</label>
                                        <Input placeholder="+27 00 000 0000" className="h-14 rounded-2xl bg-secondary/50 border-none focus-visible:ring-primary" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest ml-1">Email Address</label>
                                    <Input placeholder="john@example.com" type="email" className="h-14 rounded-2xl bg-secondary/50 border-none focus-visible:ring-primary" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest ml-1">How can we help?</label>
                                    <Textarea 
                                        placeholder="I'd like to request a prayer/visit..." 
                                        className="min-h-[150px] rounded-[2rem] bg-secondary/50 border-none focus-visible:ring-primary resize-none p-6" 
                                    />
                                </div>
                                <Button className="w-full h-16 rounded-2xl text-lg font-black uppercase tracking-widest shadow-xl shadow-primary/20 group">
                                    Send Message
                                    <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </Button>
                            </form>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}
