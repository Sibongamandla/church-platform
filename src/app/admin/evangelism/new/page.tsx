import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import EvangelismForm from "@/components/admin/EvangelismForm";
import { prisma } from "@/lib/prisma";

export default async function NewProfilePage() {
    // Fetch members who DON'T have a profile yet
    const members = await prisma.member.findMany({
        where: {
            smartProfile: {
                is: null
            },
            status: "ACTIVE"
        },
        orderBy: { lastName: "asc" }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/evangelism"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-background text-muted-foreground transition-colors hover:bg-muted"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <h1 className="text-2xl font-bold tracking-tight">New Smart Profile</h1>
            </div>

            <EvangelismForm members={members} />
        </div>
    );
}
