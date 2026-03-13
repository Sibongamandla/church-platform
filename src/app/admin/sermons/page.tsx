import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Play, Calendar, Trash2, Pencil } from "lucide-react";
import { deleteSermonAction } from "@/app/actions/sermons";

export default async function SermonsAdminPage() {
    const sermons = await (prisma as any).sermon.findMany({
        orderBy: { date: "desc" },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Sermons</h1>
                <Link
                    href="/admin/sermons/new"
                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Sermon
                </Link>
            </div>

            <div className="grid gap-4">
                {sermons.length === 0 ? (
                    <div className="text-center py-16 bg-muted/20 rounded-xl border border-dashed">
                        <Play className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                        <h3 className="text-sm font-semibold text-foreground">No sermons yet</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Add your first sermon to display it on the website.
                        </p>
                    </div>
                ) : (
                    sermons.map((sermon: any) => (
                        <div
                            key={sermon.id}
                            className="flex items-start justify-between p-4 bg-card border rounded-lg shadow-sm"
                        >
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                    <Play className="h-5 w-5" />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {sermon.series && (
                                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                                                {sermon.series}
                                            </span>
                                        )}
                                        <h3 className="font-semibold">{sermon.title}</h3>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span>By {sermon.speaker}</span>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {sermon.date.toLocaleDateString()}
                                        </div>
                                    </div>
                                    {sermon.description && (
                                        <p className="text-xs text-muted-foreground line-clamp-1 max-w-xl">
                                            {sermon.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <Link
                                    href={`/admin/sermons/${sermon.id}/highlights`}
                                    className="px-3 py-1.5 text-sm font-medium text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                                >
                                    Highlights
                                </Link>
                                <Link
                                    href={`/admin/sermons/${sermon.id}/edit`}
                                    className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                                >
                                    <Pencil className="h-4 w-4" />
                                </Link>
                                <form action={deleteSermonAction}>
                                    <input type="hidden" name="id" value={sermon.id} />
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
