import { getActiveSession } from "@/lib/sessions";
import { ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import { CheckInKioskForm } from "./CheckInKioskForm";

export default async function CheckInKioskPage() {
    const session = await getActiveSession();

    if (!session) {
        return (
            <div className="min-h-screen bg-muted flex flex-col items-center justify-center p-6 text-center">
                <div className="max-w-md space-y-6">
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto">
                        <Clock className="h-10 w-10" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">No Active Session</h1>
                        <p className="text-muted-foreground text-lg">
                            Check-in for Sunday, Wednesday, and Friday services opens 30 minutes before and closes 1 hour after the service starts.
                        </p>
                    </div>
                    <div className="pt-4">
                        <Link 
                            href="/admin/attendance"
                            className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <CheckInKioskForm session={session} />
    );
}
