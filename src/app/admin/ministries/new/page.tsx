"use client";

import { useActionState } from "react";
import { createMinistryGroupAction } from "@/app/actions/ministries";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function NewMinistryGroupPage() {
    const [state, action, isPending] = useActionState(createMinistryGroupAction, null);

    return (
        <div className="space-y-6 max-w-2xl">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/ministries"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-background text-muted-foreground transition-colors hover:bg-muted"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <h1 className="text-2xl font-bold tracking-tight">Create Ministry Group</h1>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                <form action={action} className="space-y-6">
                    {state?.error && (
                        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive font-medium border border-destructive/20">
                            {state.error}
                        </div>
                    )}
                    {state?.success && (
                        <div className="rounded-md bg-green-500/15 p-3 text-sm text-green-600 font-medium border border-green-500/20">
                            Group created successfully! Redirecting...
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Group Name</Label>
                            <Input
                                id="name"
                                name="name"
                                required
                                placeholder="e.g. Youth Ministry, Sandton Cell Group"
                                disabled={isPending || state?.success}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type">Group Type</Label>
                            <select
                                id="type"
                                name="type"
                                required
                                defaultValue="CELL"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                disabled={isPending || state?.success}
                            >
                                <option value="CELL">Cell Group / Home Group</option>
                                <option value="MINISTRY">Ministry (e.g., Youth, Men's)</option>
                                <option value="DEPARTMENT">Department</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Brief description of the group's purpose..."
                                className="min-h-[100px]"
                                disabled={isPending || state?.success}
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button type="submit" disabled={isPending || state?.success}>
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Create Group
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
