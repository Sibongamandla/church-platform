import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

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
            <AdminSidebar user={user} />

            {/* Main content — offset for desktop sidebar, top bar for mobile */}
            <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 p-4 md:p-8 min-w-0">
                {children}
            </main>
        </div>
    );
}
