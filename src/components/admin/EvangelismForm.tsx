"use client";

import { useActionState, useState } from "react";
import { createSmartProfileAction } from "@/app/actions/evangelism";
import { Loader2, Save } from "lucide-react";
import { Member } from "@prisma/client";

export default function EvangelismForm({ members }: { members: Member[] }) {
    const [state, action, isPending] = useActionState(createSmartProfileAction, null);

    // Controlled state for autofill
    const [slug, setSlug] = useState("");
    const [bio, setBio] = useState("");

    const handleMemberChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const memberId = e.target.value;
        const member = members.find(m => m.id === memberId);

        if (member) {
            // Autofill Slug: john-doe
            const autoSlug = `${member.firstName}-${member.lastName}`.toLowerCase().replace(/[^a-z0-9-]/g, "-");
            setSlug(autoSlug);

            // Autofill Bio
            setBio(`Hi! I'm ${member.firstName}, a member of Grace Community Church.`);
        }
    };

    return (
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 max-w-2xl">
            <form action={action} className="space-y-6">
                {state?.error && (
                    <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive font-medium">
                        {state.error}
                    </div>
                )}

                {state?.success && (
                    <div className="rounded-md bg-green-500/15 p-3 text-sm text-green-700 font-medium">
                        Profile created successfully!
                    </div>
                )}

                <div className="space-y-2">
                    <label htmlFor="memberId" className="text-sm font-medium">Select Member</label>
                    <select
                        id="memberId"
                        name="memberId"
                        required
                        onChange={handleMemberChange}
                        className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                        <option value="">-- Choose a member --</option>
                        {members.map(m => (
                            <option key={m.id} value={m.id}>{m.lastName}, {m.firstName}</option>
                        ))}
                    </select>
                    <p className="text-xs text-muted-foreground">Only showing active members without an existing profile.</p>
                </div>

                <div className="space-y-2">
                    <label htmlFor="slug" className="text-sm font-medium">
                        Profile Slug (URL)
                    </label>
                    <div className="flex items-center">
                        <span className="bg-muted px-3 py-2 border border-r-0 rounded-l-md text-sm text-muted-foreground">/e/</span>
                        <input
                            id="slug"
                            name="slug"
                            required
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            pattern="^[a-z0-9-]+$"
                            title="Lowercase letters, numbers, and hyphens only"
                            className="flex h-10 w-full rounded-r-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            placeholder="john-doe"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="bio" className="text-sm font-medium">
                        Short Bio
                    </label>
                    <textarea
                        id="bio"
                        name="bio"
                        rows={3}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Serving in the Kids Ministry..."
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="avatar" className="text-sm font-medium">Profile Picture</label>
                    <input
                        id="avatar"
                        name="avatar"
                        type="file"
                        accept="image/*"
                        className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-muted-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <p className="text-xs text-muted-foreground">Upload a JPG or PNG (Max 4MB).</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="space-y-2">
                        <label htmlFor="whatsapp" className="text-sm font-medium">WhatsApp Number</label>
                        <input
                            id="whatsapp"
                            name="whatsapp"
                            placeholder="27821234567"
                            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="instagram" className="text-sm font-medium">Instagram Username</label>
                        <input
                            id="instagram"
                            name="instagram"
                            placeholder="@username"
                            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="twitter" className="text-sm font-medium">Twitter/X Username</label>
                        <input
                            id="twitter"
                            name="twitter"
                            placeholder="@username"
                            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="linkedin" className="text-sm font-medium">LinkedIn URL</label>
                        <input
                            id="linkedin"
                            name="linkedin"
                            placeholder="https://linkedin.com/in/..."
                            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-wait"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Create Profile
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
