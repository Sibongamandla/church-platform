"use client";

import { useState, useRef, useEffect } from "react";
import { searchMembersForKioskAction, checkInMemberAction } from "@/app/actions/attendance";
import Link from "next/link";
import { ArrowLeft, Search, CheckCircle, UserCheck, Loader2, X, Calendar } from "lucide-react";

function useDebounceValue<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

export function CheckInKioskForm({ session }: { session: any }) {
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounceValue(query, 300);
    const [results, setResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [lastCheckIn, setLastCheckIn] = useState<{ name: string; time: Date } | null>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        async function search() {
            if (debouncedQuery.length < 2) {
                setResults([]);
                return;
            }
            setIsSearching(true);
            const data = await searchMembersForKioskAction(debouncedQuery);
            setResults(data);
            setIsSearching(false);
        }
        search();
    }, [debouncedQuery]);

    const handleCheckIn = async (member: any) => {
        const res = await checkInMemberAction(member.id);

        if (res.success) {
            setLastCheckIn({ name: `${member.firstName} ${member.lastName}`, time: new Date() });
            setQuery("");
            setResults([]);
            searchInputRef.current?.focus();

            setTimeout(() => setLastCheckIn(null), 3000);
        } else {
            alert(res.message);
        }
    };

    return (
        <div className="min-h-screen bg-muted flex flex-col items-center pt-10 px-4">
            <div className="w-full max-w-2xl flex items-center justify-between mb-8">
                <Link
                    href="/admin/attendance"
                    className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Exit Kiosk
                </Link>
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Self Check-in</h1>
                    <div className="flex items-center justify-center gap-2 text-primary font-medium">
                        <Calendar className="h-4 w-4" />
                        {session.name}
                    </div>
                </div>
                <div className="w-20" />
            </div>

            {lastCheckIn && (
                <div className="w-full max-w-2xl mb-6 animate-fade-in-up">
                    <div className="bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 p-4 rounded-xl flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="h-6 w-6" />
                            <div>
                                <p className="font-bold text-lg">Checked in!</p>
                                <p className="text-sm">Welcome, {lastCheckIn.name}</p>
                            </div>
                        </div>
                        <button onClick={() => setLastCheckIn(null)} className="p-2 hover:bg-green-500/10 rounded-full">
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            )}

            <div className="w-full max-w-2xl relative">
                <div className="relative">
                    <Search className="absolute left-4 top-4 h-6 w-6 text-muted-foreground" />
                    <input
                        ref={searchInputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Start typing name..."
                        className="w-full h-14 pl-12 pr-4 text-lg rounded-xl border border-input bg-background shadow-xs focus:ring-2 focus:ring-primary focus:outline-none"
                        autoFocus
                    />
                    {isSearching && (
                        <div className="absolute right-4 top-4">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    )}
                </div>

                {results.length > 0 && query.length >= 2 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl border shadow-lg overflow-hidden z-10 divide-y">
                        {results.map((member) => (
                            <div key={member.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                                <div>
                                    <p className="font-semibold text-lg">{member.firstName} {member.lastName}</p>
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                        <span>{member.phone || "No phone"}</span>
                                        {member.email && <span>• {member.email}</span>}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleCheckIn(member)}
                                    className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90"
                                >
                                    <UserCheck className="mr-2 h-5 w-5" />
                                    Check In
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {results.length === 0 && query.length >= 2 && !isSearching && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl border shadow-lg p-8 text-center text-muted-foreground">
                        No members found matching "{query}"
                    </div>
                )}
            </div>
        </div>
    );
}
