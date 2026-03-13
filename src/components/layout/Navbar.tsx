"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Navbar({ user }: { user: any }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    const navigation = [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Events", href: "/events" },
        { name: "Sermons", href: "/sermons" },
        { name: user ? "Check-in" : "Visit", href: "/check-in" },
    ];

    return (
        <>
            <header className={cn(
                "fixed top-6 left-0 right-0 z-50 flex justify-center px-4 transition-all duration-300",
                isScrolled ? "scale-95" : "scale-100"
            )}>
                <nav className={cn(
                    "flex items-center justify-between p-2 pl-6 pr-2 rounded-full border border-white/20 shadow-xl transition-all duration-300 w-full max-w-5xl",
                    "bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:bg-black/60 dark:border-white/10"
                )}>
                    {/* Brand */}
                    <Link href="/" className="flex items-center gap-2 mr-8">
                        {/* <img src="/logo.png" alt="GNM Logo" className="h-10 w-auto" /> */}
                        <span className="font-heading text-xl font-bold tracking-tight uppercase text-primary">
                            Great Nation<span className="text-muted-foreground">Ministries</span>
                        </span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-1 bg-secondary/50 p-1 rounded-full border border-white/5">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "px-5 py-2 rounded-full text-sm font-medium transition-all duration-300",
                                    pathname === item.href
                                        ? "bg-white text-black shadow-sm dark:bg-neutral-800 dark:text-white"
                                        : "text-muted-foreground hover:text-primary hover:bg-white/50 dark:hover:bg-white/10"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {user ? (
                            <Link href="/dashboard" className="hidden md:block">
                                <Button variant="ghost" className="rounded-full px-6 hover:bg-white/50 dark:hover:bg-white/10">
                                    Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link href="/login" className="hidden md:block">
                                    <Button variant="ghost" className="rounded-full px-6 hover:bg-white/50 dark:hover:bg-white/10">
                                        Login
                                    </Button>
                                </Link>
                                <Link href="/check-in">
                                    <Button className="rounded-full px-6 font-bold shadow-lg shadow-primary/20 bg-primary text-primary-foreground hover:bg-primary/90">
                                        I'm New
                                    </Button>
                                </Link>
                            </>
                        )}


                        {/* Mobile Toggle */}
                        <div className="md:hidden ml-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full"
                                onClick={() => setMobileMenuOpen(true)}
                            >
                                <Menu className="h-6 w-6" />
                            </Button>
                        </div>
                    </div>
                </nav>
            </header>

            {/* Mobile Menu Overlay */}
            <div className={cn(
                "fixed inset-0 z-[60] bg-background/95 backdrop-blur-3xl transition-all duration-500 flex flex-col p-6",
                mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
            )}>
                <div className="flex justify-between items-center mb-12">
                    <span className="font-heading text-2xl font-bold tracking-tight uppercase">
                        Great Nation<span className="text-muted-foreground">Ministries</span>
                    </span>
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full border-2"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <X className="h-6 w-6" />
                    </Button>
                </div>

                <div className="flex flex-col gap-4">
                    {navigation.map((item, i) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="font-heading text-5xl font-black uppercase tracking-tighter hover:text-muted-foreground transition-colors flex items-center justify-between group"
                            style={{ transitionDelay: `${i * 50}ms` }}
                        >
                            {item.name}
                            <ArrowRight className="h-8 w-8 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                        </Link>
                    ))}
                </div>

                <div className="mt-auto grid grid-cols-2 gap-4">
                    {user ? (
                        <Link href="/dashboard" className="w-full col-span-2">
                            <Button variant="outline" className="w-full h-14 text-lg rounded-2xl border-2">
                                Dashboard
                            </Button>
                        </Link>
                    ) : (
                        <>
                            <Link href="/login" className="w-full">
                                <Button variant="outline" className="w-full h-14 text-lg rounded-2xl border-2">
                                    Member Login
                                </Button>
                            </Link>
                            <Link href="/check-in" className="w-full">
                                <Button className="w-full h-14 text-lg rounded-2xl bg-primary text-primary-foreground">
                                    Plan a Visit
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
