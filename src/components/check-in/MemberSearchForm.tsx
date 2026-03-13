"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Search, Check, User, AlertCircle, ArrowLeft } from "lucide-react";
import { searchMembersForKioskAction, checkInMultipleMembersAction } from "@/app/actions/attendance";
import { useRouter } from "next/navigation";

export function MemberSearchForm() {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<any[] | null>(null);
    const [checkInLoading, setCheckInLoading] = useState(false);
    
    // Family Selection State
    const [selectedMember, setSelectedMember] = useState<any | null>(null);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    async function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        if (!query || query.length < 2) return;

        setLoading(true);
        setResults(null);
        setSelectedMember(null);
        try {
            const data = await searchMembersForKioskAction(query);
            setResults(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    function handleSelectRecord(member: any) {
        setSelectedMember(member);
        
        // Auto-select everyone in the family by default
        const toSelect = new Set<string>();
        toSelect.add(member.id);
        
        if (member.family?.members) {
             member.family.members.forEach((m: any) => toSelect.add(m.id));
        }
        
        setSelectedIds(toSelect);
    }

    function toggleSelection(id: string) {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    }

    async function handleFinalCheckIn() {
        if (selectedIds.size === 0) return;
        
        setCheckInLoading(true);
        try {
            const res = await checkInMultipleMembersAction(Array.from(selectedIds));
            if (res?.success) {
                router.push("/check-in?success=true");
            }
        } catch (error) {
            console.error(error);
            setCheckInLoading(false);
        }
    }

    if (selectedMember) {
        // Collect all available people to check in (primary + family)
        const allPeople = [selectedMember];
        if (selectedMember.family?.members) {
            selectedMember.family.members.forEach((m: any) => {
                if (m.id !== selectedMember.id) {
                    allPeople.push(m);
                }
            });
        }

        return (
            <div className="space-y-6 animate-fade-in-up">
                <Button 
                    variant="ghost" 
                    onClick={() => setSelectedMember(null)} 
                    className="pl-0 text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to search results
                </Button>

                <div className="space-y-2 text-left">
                    <h3 className="text-xl font-bold">Who is checking in today?</h3>
                    <p className="text-sm text-muted-foreground">
                        Select yourself and any family members joining you.
                    </p>
                </div>

                <div className="space-y-3">
                    {allPeople.map((person) => (
                        <label 
                            key={person.id}
                            className={`flex items-center justify-between p-4 rounded-xl border bg-white cursor-pointer transition-all ${
                                selectedIds.has(person.id) ? "border-primary shadow-sm bg-primary/5" : "hover:border-primary/50"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors ${
                                    selectedIds.has(person.id) ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                                }`}>
                                    <User className="h-5 w-5" />
                                </div>
                                <div className="text-left">
                                    <p className={`font-bold ${selectedIds.has(person.id) ? "text-primary" : "text-foreground"}`}>
                                        {person.firstName} {person.lastName}
                                    </p>
                                    {person.id === selectedMember.id && <p className="text-xs text-muted-foreground">Primary</p>}
                                </div>
                            </div>
                            
                            <div className={`h-6 w-6 rounded flex items-center justify-center transition-all ${
                                selectedIds.has(person.id) ? "bg-primary text-primary-foreground" : "border-2"
                            }`}>
                                {selectedIds.has(person.id) && <Check className="h-4 w-4" />}
                            </div>
                            
                            {/* Hidden checkbox for accessibility/logic */}
                            <input 
                                type="checkbox" 
                                className="sr-only"
                                checked={selectedIds.has(person.id)}
                                onChange={() => toggleSelection(person.id)}
                            />
                        </label>
                    ))}
                </div>

                <Button 
                    className="w-full rounded-full h-12 text-lg" 
                    onClick={handleFinalCheckIn}
                    disabled={selectedIds.size === 0 || checkInLoading}
                >
                    {checkInLoading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Checking in...
                        </>
                    ) : (
                        `Check In ${selectedIds.size} Person${selectedIds.size !== 1 ? 's' : ''}`
                    )}
                </Button>
            </div>
        );
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
                            disabled={loading}
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
                    disabled={loading || query.length < 2}
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
                        <p className="text-xs text-muted-foreground">Try a different spelling or number, or switch to "I'm New Here".</p>
                    </div>
                )}

                {results && results.length > 0 && (
                    <div className="space-y-2 animate-fade-in-up">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Select your record</Label>
                        {results.map((member) => (
                            <button
                                key={member.id}
                                onClick={() => handleSelectRecord(member)}
                                className="w-full flex items-center justify-between p-4 rounded-xl border bg-white hover:border-primary hover:shadow-md transition-all text-left group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        <User className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-primary">{member.firstName} {member.lastName}</p>
                                        <p className="text-xs text-muted-foreground">{member.phone}</p>
                                    </div>
                                </div>
                                <div className="h-8 w-8 rounded-full border flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-primary-foreground transition-colors">
                                    <Check className="h-4 w-4" />
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
