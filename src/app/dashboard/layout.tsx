import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard,
    User,
    LogOut,
    Menu
} from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-muted/20 flex flex-col">
            {/* Header / Mobile Nav */}
            <header className="bg-background border-b h-16 flex items-center justify-between px-4 lg:px-8">
                <div className="flex items-center gap-2">
                    <Link href="/" className="font-bold text-xl tracking-tight text-primary">
                        Grace Community
                    </Link>
                    <span className="text-muted-foreground hidden sm:inline">| Member Portal</span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{user.name}</span>
                    </div>
                    <form action={logoutAction}>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                            <LogOut className="h-4 w-4 sm:mr-2" />
                            <span className="hidden sm:inline">Sign Out</span>
                        </Button>
                    </form>
                </div>
            </header>

            <div className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full">
                {/* Sidebar / Desktop Nav */}
                <aside className="w-full md:w-64 bg-background/50 border-r-0 md:border-r p-4 hidden md:block">
                    <nav className="space-y-1">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors text-foreground"
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            Overview
                        </Link>
                        <Link
                            href="/dashboard/profile"
                            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                        >
                            <User className="h-4 w-4" />
                            My Smart Profile
                        </Link>
                        {["SUPER_ADMIN", "CONTENT_EDITOR", "FINANCE_ADMIN", "REGISTRY_CLERK"].includes(user.role) && (
                            <Link
                                href="/admin"
                                className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground mt-4 border-t pt-4"
                            >
                                <LayoutDashboard className="h-4 w-4" />
                                Admin Portal
                            </Link>
                        )}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-4 md:p-8">
                    {children}
                </main>
            </div>

            {/* Mobile Bottom Nav */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-2 flex justify-around z-50">
                <Link
                    href="/dashboard"
                    className="flex flex-col items-center p-2 text-xs font-medium text-muted-foreground hover:text-primary"
                >
                    <LayoutDashboard className="h-5 w-5 mb-1" />
                    Home
                </Link>
                <Link
                    href="/dashboard/profile"
                    className="flex flex-col items-center p-2 text-xs font-medium text-muted-foreground hover:text-primary"
                >
                    <User className="h-5 w-5 mb-1" />
                    Profile
                </Link>
            </div>
        </div>
    );
}
