import { ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";
import { ManualSessionForm } from "./ManualSessionForm";

export default function CreateManualSessionPage() {
    return (
        <div className="max-w-2xl mx-auto p-6 space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/admin/attendance" className="p-2 hover:bg-muted rounded-full transition-colors">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Create Manual Session</h1>
                    <p className="text-muted-foreground">Schedule a session outside of standard service hours</p>
                </div>
            </div>

            <ManualSessionForm />

            <div className="rounded-xl bg-primary/5 border border-primary/10 p-4 text-sm text-primary flex gap-3">
                <Calendar className="h-5 w-5 shrink-0" />
                <p>
                    <strong>Note:</strong> Creating a manual session will enable the kiosk mode for that specific time window. Sunday, Wednesday, and Friday services are automated and don't need manual creation.
                </p>
            </div>
        </div>
    );
}
