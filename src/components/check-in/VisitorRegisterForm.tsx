"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, UserPlus } from "lucide-react";
import { registerVisitorAction } from "@/app/actions/attendance";

export function VisitorRegisterForm({ recruiterSlug }: { recruiterSlug?: string }) {
    const [loading, setLoading] = useState(false);

    // We can't easily use existing server action directly if we want custom client transitions 
    // without `useActionState` (React 19) or similar. 
    // But since the server action redirects, we just need to show loading until that redirect happens.
    // The issue might be the form resetting before redirect.
    // Let's implement a simple handler that calls the action.

    // Actually, if we use `action={registerVisitorAction}` on the form, Next.js handles it.
    // But to show loading state, we need `useFormStatus` or similar.
    // Since we are in a client component, let's just wrap the submission.

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        // We allow the server action to handle the redirect.
        // We just set loading to true so the user sees feedback.
        // If the action redirects, this component unmounts.
        // If it returns (error), we should handle it. but our action redirects on success.
        await registerVisitorAction(formData);

        // If we get here, it means no redirect happened (error or logic fallthrough)
        setLoading(false);
    }

    return (
        <form action={handleSubmit} className="space-y-4">
            <input type="hidden" name="recruiterSlug" value={recruiterSlug || ""} />
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" name="firstName" required placeholder="Jane" disabled={loading} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" name="lastName" required placeholder="Doe" disabled={loading} />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" required placeholder="082 123 4567" disabled={loading} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <select
                        id="gender"
                        name="gender"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={loading}
                        required
                    >
                        <option value="" disabled selected>Select...</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="birthday">Date of Birth</Label>
                    <Input
                        id="birthday"
                        name="birthday"
                        type="date"
                        required
                        disabled={loading}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input id="email" name="email" type="email" placeholder="jane@example.com" disabled={loading} />
            </div>

            <Button className="w-full rounded-full" type="submit" disabled={loading}>
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Registering...
                    </>
                ) : (
                    <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Register & Check In
                    </>
                )}
            </Button>
        </form>
    );
}
