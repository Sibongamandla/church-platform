import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, ExternalLink, Trash2, Link as LinkIcon } from "lucide-react";
import { deleteLinkAction } from "@/app/actions/links";

export default async function LinksDashboard() {
    const links = await prisma.shortLink.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Forever QR Links</h1>
                    <p className="text-muted-foreground">Manage redirect links for QR codes.</p>
                </div>
                <Link
                    href="/admin/links/new"
                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Link
                </Link>
            </div>

            <div className="rounded-md border bg-card shadow-sm">
                <table className="w-full caption-bottom text-sm text-left">
                    <thead className="[&_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50">
                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Slug</th>
                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Destination</th>
                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Clicks</th>
                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                        {links.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-muted-foreground">
                                    No links created yet.
                                </td>
                            </tr>
                        ) : (
                            links.map((link) => (
                                <tr key={link.id} className="border-b transition-colors hover:bg-muted/50">
                                    <td className="p-4 align-middle font-medium">
                                        <div className="flex items-center gap-2">
                                            <LinkIcon className="h-4 w-4 text-muted-foreground" />
                                            /go/{link.slug}
                                        </div>
                                    </td>
                                    <td className="p-4 align-middle max-w-xs truncate" title={link.url}>
                                        {link.url}
                                    </td>
                                    <td className="p-4 align-middle">
                                        {link.clicks}
                                    </td>
                                    <td className="p-4 align-middle text-right flex justify-end gap-2">
                                        <a href={`/go/${link.slug}`} target="_blank" className="p-2 hover:bg-muted rounded-md text-primary">
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                        <form action={deleteLinkAction}>
                                            <input type="hidden" name="id" value={link.id} />
                                            <button className="p-2 hover:bg-destructive/10 rounded-md text-destructive">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
