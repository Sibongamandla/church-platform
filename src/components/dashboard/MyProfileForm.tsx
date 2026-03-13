"use client";

import { useActionState, useState } from "react";
import { saveMyProfileAction } from "@/app/actions/evangelism";
import { Loader2, Save } from "lucide-react";
import { Member } from "@prisma/client";
// SmartProfile type should be imported from client if generated, or we can treat as any if still glitchy, but generation should fix it.
import type { SmartProfile } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function MyProfileForm({ member, profile }: { member: Member, profile: SmartProfile | null }) {
    const [state, action, isPending] = useActionState(saveMyProfileAction, null);

    // Initial state
    const [slug, setSlug] = useState(profile?.slug || `${member.firstName}-${member.lastName}`.toLowerCase().replace(/[^a-z0-9-]/g, "-"));
    const [bio, setBio] = useState(profile?.bio || `Hi! I'm ${member.firstName}, a member of Grace Community Church.`);

    return (
        <form action={action} className="space-y-6">
            {state?.error && (
                <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive font-medium">
                    {state.error}
                </div>
            )}

            {state?.success && (
                <div className="rounded-md bg-green-500/15 p-3 text-sm text-green-700 font-medium">
                    Profile saved successfully!
                </div>
            )}

            <input type="hidden" name="memberId" value={member.id} />

            <div className="space-y-2">
                <Label htmlFor="slug">Profile URL Slug</Label>
                <div className="flex items-center">
                    <span className="bg-muted px-3 py-2 border border-r-0 rounded-l-md text-sm text-muted-foreground">/e/</span>
                    <Input
                        id="slug"
                        name="slug"
                        required
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        pattern="^[a-z0-9-]+$"
                        className="rounded-l-none"
                    />
                </div>
                <p className="text-xs text-muted-foreground">Lowercase letters, numbers, and hyphens only.</p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="bio">Short Bio</Label>
                <Textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="avatar">Profile Picture</Label>
                <Input
                    id="avatar"
                    name="avatar"
                    type="file"
                    accept="image/*"
                />
                {profile?.avatarUrl && (
                    <p className="text-xs text-muted-foreground mt-1">Current: <a href={profile.avatarUrl} target="_blank" className="underline">View Image</a></p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp Number</Label>
                    <Input id="whatsapp" name="whatsapp" defaultValue={profile?.whatsapp || ""} placeholder="27821234567" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram Username</Label>
                    <Input id="instagram" name="instagram" defaultValue={profile?.instagram || ""} placeholder="@username" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter/X Username</Label>
                    <Input id="twitter" name="twitter" defaultValue={profile?.twitter || ""} placeholder="@username" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn URL</Label>
                    <Input id="linkedin" name="linkedin" defaultValue={profile?.linkedin || ""} placeholder="https://linkedin.com/..." />
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button disabled={isPending}>
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Profile
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
