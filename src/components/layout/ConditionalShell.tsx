"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

interface ConditionalShellProps {
    user: any;
}

const HIDDEN_ROUTES = ["/admin", "/dashboard"];

export function ConditionalShell({ user }: ConditionalShellProps) {
    const pathname = usePathname();
    const hide = HIDDEN_ROUTES.some((route) => pathname.startsWith(route));

    if (hide) return null;

    return (
        <>
            <Navbar user={user} />
            {/* Spacer to push content below the fixed navbar */}
            <div className="h-20" />
        </>
    );
}

export function ConditionalFooter() {
    const pathname = usePathname();
    const hide = HIDDEN_ROUTES.some((route) => pathname.startsWith(route));
    if (hide) return null;
    return <Footer />;
}
