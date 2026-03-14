import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { EditAnnouncementForm } from "./EditAnnouncementForm";

export default async function EditAnnouncementPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const announcement = await prisma.announcement.findUnique({
        where: { id },
    });

    if (!announcement) notFound();

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">Edit Announcement</h1>
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 max-w-2xl">
                <EditAnnouncementForm announcement={announcement} />
            </div>
        </div>
    );
}
