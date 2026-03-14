import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Calendar, Tag, Trash2, Edit2 } from "lucide-react";
import { deleteAnnouncementAction } from "@/app/actions/announcements";

export default async function AnnouncementsAdminPage() {
    const announcements = await prisma.announcement.findMany({
        orderBy: { date: "desc" },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
                <Link
                    href="/admin/announcements/new"
                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    New Announcement
                </Link>
            </div>

            <div className="grid gap-4">
                {announcements.length === 0 ? (
                    <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed">
                        <h3 className="mt-2 text-sm font-semibold text-foreground">No announcements</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Create your first announcement to display on the home page.
                        </p>
                    </div>
                ) : (
                    announcements.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-start justify-between p-4 bg-card border rounded-lg shadow-sm"
                        >
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                                        {item.category}
                                    </span>
                                    <h3 className="font-semibold">{item.title}</h3>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2 max-w-xl">
                                    {item.content}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {item.date.toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Link
                                    href={`/admin/announcements/${item.id}/edit`}
                                    className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                                >
                                    <span className="sr-only">Edit</span>
                                    <Edit2 className="h-4 w-4" />
                                </Link>
                                <form action={deleteAnnouncementAction}>
                                    <input type="hidden" name="id" value={item.id} />
                                    <button
                                        type="submit"
                                        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                                    >
                                        <span className="sr-only">Delete</span>
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </form>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
