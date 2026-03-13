import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, MapPin, Mail, Phone } from "lucide-react";

const footerNavigation = {
    quickLinks: [
        { name: "About Us", href: "/about" },
        { name: "Events", href: "/events" },
        { name: "Sermons", href: "/sermons" },
        { name: "Contact", href: "/contact" },
    ],
    support: [
        { name: "Donate", href: "/give" },
        { name: "Prayer Requests", href: "/contact" },
        { name: "Volunteer", href: "/volunteer" },
    ],
    legal: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
    ],
    social: [
        { name: "Facebook", href: "#", icon: Facebook },
        { name: "Instagram", href: "#", icon: Instagram },
        { name: "Twitter", href: "#", icon: Twitter },
        { name: "YouTube", href: "#", icon: Youtube },
    ],
};

export function Footer() {
    return (
        <footer className="bg-muted/30 border-t border-border/40 pt-16 pb-8">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="space-y-4">
                        <Link href="/" className="inline-block">
                            <span className="text-2xl font-bold tracking-tighter text-foreground uppercase">
                                Great Nation<span className="text-primary">Ministries</span>
                            </span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                            A vibrant community dedicated to loving Jesus and loving people. Join
                            our family as we grow in faith together.
                        </p>
                        <div className="flex space-x-4 pt-2">
                            {footerNavigation.social.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <span className="sr-only">{item.name}</span>
                                    <item.icon className="h-5 w-5" aria-hidden="true" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                            Quick Links
                        </h3>
                        <ul className="space-y-3">
                            {footerNavigation.quickLinks.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                            Get Involved
                        </h3>
                        <ul className="space-y-3">
                            {footerNavigation.support.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                            Visit Us
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-sm text-muted-foreground">
                                <MapPin className="h-5 w-5 shrink-0 text-primary" />
                                <span>
                                    123 Church Avenue
                                    <br />
                                    Cityville, ST 12345
                                    <br />
                                    Sunday Services: 9am & 11am
                                </span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Phone className="h-4 w-4 shrink-0 text-primary" />
                                <a href="tel:+1234567890" className="hover:text-primary">
                                    (555) 123-4567
                                </a>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Mail className="h-4 w-4 shrink-0 text-primary" />
                                <a href="mailto:info@greatnationministries.com" className="hover:text-primary">
                                    info@greatnationministries.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border/40 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-muted-foreground text-center md:text-left font-medium">
                        &copy; {new Date().getFullYear()} Great Nation Ministries. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        {footerNavigation.legal.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
