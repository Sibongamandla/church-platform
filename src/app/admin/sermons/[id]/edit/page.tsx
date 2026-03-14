import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { EditSermonForm } from "./EditSermonForm";

export default async function EditSermonPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const sermon = await prisma.sermon.findUnique({ where: { id } });
    if (!sermon) notFound();

    return (
        <div className="max-w-2xl space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Edit Sermon</h1>
                <p className="text-muted-foreground mt-1">Update the sermon details below.</p>
            </div>
            <EditSermonForm sermon={sermon} />
        </div>
    );
}
