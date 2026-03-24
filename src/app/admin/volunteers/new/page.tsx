"use client";

import { useActionState } from "react";
import { createTeamAction } from "@/app/actions/volunteers";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function NewVolunteerTeamPage() {
    const [state, action, isPending] = useActionState(createTeamAction, null);

    return (
        <div className="space-y-6 max-w-2xl">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/volunteers"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-background text-muted-foreground transition-colors hover:bg-muted"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <h1 className="text-2xl font-bold tracking-tight">Create Volunteer Team</h1>
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
                            Team created successfully! Redirecting...
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Team Name</Label>
                            <Input
                                id="name"
                                name="name"
                                required
                                placeholder="e.g. Worship, Ushers, Production"
                                disabled={isPending || state?.success}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Brief description of the team's responsibilities..."
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
                                    Create Team
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
