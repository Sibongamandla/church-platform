import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
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
    Link as LinkIcon,
    Video,
    UserCheck
} from "lucide-react";
import { logoutAction } from "@/app/actions/auth";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="flex min-h-screen bg-muted/20">
            {/* Sidebar */}
            <aside className="w-64 bg-background border-r fixed inset-y-0 z-50">
                <div className="h-16 flex items-center px-6 border-b">
                    <span className="text-xl font-bold tracking-tight">Admin Portal</span>
                </div>
                <div className="p-4 space-y-1">
                    <Link
                        href="/admin"
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors text-foreground"
                    >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                    </Link>
                    <Link
                        href="/admin/events"
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    >
                        <Calendar className="h-4 w-4" />
                        Events
                    </Link>
                    <Link
                        href="/admin/announcements"
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    >
                        <Megaphone className="h-4 w-4" />
                        Announcements
                    </Link>
                    <Link
                        href="/admin/members"
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    >
                        <Users className="h-4 w-4" />
                        Members
                    </Link>
                    <Link
                        href="/admin/attendance"
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    >
                        <ClipboardCheck className="h-4 w-4" />
                        Attendance
                    </Link>
                    <Link
                        href="/admin/evangelism"
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    >
                        <QrCode className="h-4 w-4" />
                        Evangelism
                    </Link>
                    <Link
                        href="/admin/sermons"
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    >
                        <Video className="h-4 w-4" />
                        Sermons
                    </Link>
                    <Link
                        href="/admin/visitors"
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    >
                        <UserCheck className="h-4 w-4" />
                        Visitors
                    </Link>
                    <Link
                        href="/admin/qrcodes"
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    >
                        <QrCode className="h-4 w-4" />
                        QR Codes
                    </Link>
                    <Link
                        href="/admin/settings"
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    >
                        <Settings className="h-4 w-4" />
                        Settings
                    </Link>
                </div>
                <div className="absolute bottom-4 left-0 right-0 p-4 border-t">
                    <div className="flex items-center gap-3 px-3 mb-4">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {user.name?.[0] || "U"}
                        </div>
                        <div className="text-sm">
                            <p className="font-medium text-foreground">{user.name}</p>
                            <p className="text-xs text-muted-foreground capitalize">
                                {user.role ? (user.role.toLowerCase().replace("_", " ")) : "Member"}
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
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
