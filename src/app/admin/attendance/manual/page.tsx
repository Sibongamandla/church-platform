import { ArrowLeft, Calendar, Save } from "lucide-react";
import Link from "next/link";
import { createManualSessionAction } from "@/app/actions/sessions";

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

            <form action={createManualSessionAction} className="bg-card border rounded-xl p-8 shadow-sm space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Session Name
                        </label>
                        <input
                            name="name"
                            required
                            placeholder="e.g., Youth Night, Prayer Meeting"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Date
                        </label>
                        <input
                            name="date"
                            type="date"
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">
                                Start Time
                            </label>
                            <input
                                name="startTime"
                                type="time"
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">
                                End Time
                            </label>
                            <input
                                name="endTime"
                                type="time"
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex gap-4">
                    <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                    >
                        <Save className="mr-2 h-4 w-4" />
                        Create Session
                    </button>
                    <Link
                        href="/admin/attendance"
                        className="inline-flex items-center justify-center rounded-md border bg-background px-8 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-muted"
                    >
                        Cancel
                    </Link>
                </div>
            </form>

            <div className="rounded-xl bg-primary/5 border border-primary/10 p-4 text-sm text-primary flex gap-3">
                <Calendar className="h-5 w-5 shrink-0" />
                <p>
                    <strong>Note:</strong> Creating a manual session will enable the kiosk mode for that specific time window. Sunday, Wednesday, and Friday services are automated and don't need manual creation.
                </p>
            </div>
        </div>
    );
}
