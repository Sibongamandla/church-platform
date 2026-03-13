"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Search, Check, User, AlertCircle } from "lucide-react";
import { searchMembersForKioskAction, checkInMemberAction } from "@/app/actions/attendance";
import { useRouter } from "next/navigation";

export function MemberSearchForm() {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<any[] | null>(null);
    const [checkInLoading, setCheckInLoading] = useState<string | null>(null);

    async function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        if (!query || query.length < 2) return;

        setLoading(true);
        setResults(null);
        try {
            const data = await searchMembersForKioskAction(query);
            setResults(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function handleCheckIn(memberId: string) {
        setCheckInLoading(memberId);
        try {
            const res = await checkInMemberAction(memberId);
            if (res?.success) {
                router.push("/check-in?success=true");
            }
        } catch (error) {
            console.error(error);
            setCheckInLoading(null);
        }
    }

    return (
        <div className="space-y-6">
            <form onSubmit={handleSearch} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="search">Search your name (or phone)</Label>
                    <div className="relative">
                        <Input
                            id="search"
                            placeholder="e.g. John or 082..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            disabled={loading || !!checkInLoading}
                            className="pr-10"
                        />
                        {loading && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            </div>
                        )}
                    </div>
                </div>
                <Button
                    className="w-full rounded-full"
                    type="submit"
                    disabled={loading || query.length < 2 || !!checkInLoading}
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Searching...
                        </>
                    ) : (
                        <>
                            <Search className="mr-2 h-4 w-4" />
                            Find My Record
                        </>
                    )}
                </Button>
            </form>

            <div className="space-y-2">
                {results !== null && results.length === 0 && (
                    <div className="flex flex-col items-center justify-center p-6 text-center border-2 border-dashed rounded-xl bg-neutral-50">
                        <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium text-muted-foreground">No records found.</p>
                        <p className="text-xs text-muted-foreground">Try a different spelling or number, or switch to "I'm New".</p>
                    </div>
                )}

                {results && results.length > 0 && (
                    <div className="space-y-2 animate-fade-in-up">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Select your record</Label>
                        {results.map((member) => (
                            <button
                                key={member.id}
                                onClick={() => handleCheckIn(member.id)}
                                disabled={!!checkInLoading}
                                className="w-full flex items-center justify-between p-4 rounded-xl border bg-white hover:border-primary hover:shadow-md transition-all text-left group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        {checkInLoading === member.id ? (
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                        ) : (
                                            <User className="h-5 w-5" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-primary">{member.firstName} {member.lastName}</p>
                                        <p className="text-xs text-muted-foreground">{member.phone}</p>
                                    </div>
                                </div>
                                {checkInLoading === member.id ? (
                                    <span className="text-xs font-medium text-primary">Checking in...</span>
                                ) : (
                                    <div className="h-8 w-8 rounded-full border flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-primary-foreground transition-colors">
                                        <Check className="h-4 w-4" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
