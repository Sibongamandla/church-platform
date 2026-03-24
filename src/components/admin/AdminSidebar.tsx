"use client";

import { useState } from "react";
import Link from "next/link";
import {
    LayoutDashboard,
    Users,
    Calendar,
    Settings,
    LogOut,
    Megaphone,
    ClipboardCheck,
    QrCode,
    Video,
    UserCheck,
    Menu,
    X,
    HeartHandshake,
    Layers,
    Image as ImageIcon
} from "lucide-react";
import { logoutAction } from "@/app/actions/auth";

const navLinks = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/events", label: "Events", icon: Calendar },
    { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
    { href: "/admin/sermons", label: "Sermons", icon: Video },
    { href: "/admin/content", label: "Content", icon: ImageIcon },
    { href: "/admin/members", label: "Members", icon: Users },
    { href: "/admin/visitors", label: "Visitors", icon: UserCheck },
    { href: "/admin/ministries", label: "Ministries", icon: Layers },
    { href: "/admin/volunteers", label: "Volunteers", icon: HeartHandshake },
    { href: "/admin/attendance", label: "Attendance", icon: ClipboardCheck },
    { href: "/admin/qrcodes", label: "QR Codes", icon: QrCode },
    { href: "/admin/settings", label: "Settings", icon: Settings },
];

interface AdminSidebarProps {
    user: { name?: string | null; role?: string | null };
}

export function AdminSidebar({ user }: AdminSidebarProps) {
    const [open, setOpen] = useState(false);

    const SidebarContent = () => (
        <>
            <div className="h-16 flex items-center px-6 border-b flex-shrink-0">
                <span className="text-xl font-bold tracking-tight">Admin Portal</span>
            </div>
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {navLinks.map(({ href, label, icon: Icon }) => (
                    <Link
                        key={href}
                        href={href}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    >
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        {label}
                    </Link>
                ))}
            </nav>
            <div className="p-4 border-t flex-shrink-0">
                <div className="flex items-center gap-3 px-3 mb-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">
                        {user.name?.[0] || "U"}
                    </div>
                    <div className="text-sm overflow-hidden">
                        <p className="font-medium text-foreground truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground capitalize truncate">
                            {user.role ? user.role.toLowerCase().replace("_", " ") : "Member"}
                        </p>
                    </div>
                </div>
                <form action={logoutAction}>
                    <button
                        type="submit"
                        className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-destructive/10 text-destructive transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </button>
                </form>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile top bar */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-background border-b flex items-center justify-between px-4">
                <span className="text-lg font-bold tracking-tight">Admin Portal</span>
                <button
                    onClick={() => setOpen(!open)}
                    className="h-9 w-9 flex items-center justify-center rounded-md hover:bg-muted transition-colors"
                    aria-label="Toggle menu"
                >
                    {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            {/* Desktop sidebar */}
            <aside className="hidden lg:flex flex-col w-64 bg-background border-r fixed inset-y-0 z-50">
                <SidebarContent />
            </aside>

            {/* Mobile drawer backdrop */}
            {open && (
                <div
                    className="lg:hidden fixed inset-0 z-40 bg-black/50"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Mobile drawer */}
            <aside
                className={`lg:hidden fixed top-0 left-0 h-full w-72 bg-background border-r z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${
                    open ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <SidebarContent />
            </aside>
        </>
    );
}
