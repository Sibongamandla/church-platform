"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Search, Check, User, ArrowLeft, Heart, Sparkles } from "lucide-react";
import { searchMembersForKioskAction } from "@/app/actions/attendance";
import { publicJoinTeamAction } from "@/app/actions/volunteers";

type Team = { id: string; name: string; description: string | null };

export function VolunteerSignUpForm({ teams }: { teams: Team[] }) {
    const [step, setStep] = useState<"SELECT_TEAM" | "CHOOSE_METHOD" | "SEARCH" | "FORM" | "SUCCESS">("SELECT_TEAM");
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    
    // Search State
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({ firstName: "", lastName: "", phone: "", email: "" });
    const [submitting, setSubmitting] = useState(false);

    async function handleTeamSelect(team: Team) {
        setSelectedTeam(team);
        setStep("CHOOSE_METHOD");
    }

    async function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        if (searchQuery.length < 2) return;
        setLoading(true);
        try {
            const results = await searchMembersForKioskAction(searchQuery);
            setSearchResults(results);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function handleJoinWithMemberId(memberId: string) {
        if (!selectedTeam) return;
        setSubmitting(true);
        const res = await publicJoinTeamAction(selectedTeam.id, memberId);
        if (res.success) setStep("SUCCESS");
        else alert(res.error || "Failed to join");
        setSubmitting(false);
    }

    async function handleJoinWithForm(e: React.FormEvent) {
        e.preventDefault();
        if (!selectedTeam) return;
        setSubmitting(true);
        const res = await publicJoinTeamAction(selectedTeam.id, undefined, formData);
        if (res.success) setStep("SUCCESS");
        else alert(res.error || "Failed to join");
        setSubmitting(false);
    }

    if (step === "SUCCESS") {
        return (
            <div className="text-center space-y-6 py-12 animate-in fade-in zoom-in duration-500">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 text-green-600 mb-4">
                    <Check className="h-10 w-10" />
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tight">You're on the list!</h2>
                <p className="text-muted-foreground text-lg max-w-md mx-auto">
                    Thank you for volunteering for the <span className="text-foreground font-bold">{selectedTeam?.name}</span> team. Our leaders will reach out to you soon!
                </p>
                <Button onClick={() => setStep("SELECT_TEAM")} variant="outline" className="rounded-full mt-8">
                    Done
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {step !== "SELECT_TEAM" && (
                <button 
                    onClick={() => {
                        if (step === "CHOOSE_METHOD") setStep("SELECT_TEAM");
                        else setStep("CHOOSE_METHOD");
                    }}
                    className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </button>
            )}

            {step === "SELECT_TEAM" && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teams.map(team => (
                        <div key={team.id} className="group relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="absolute top-0 left-0 w-2 h-full bg-primary transform origin-left scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />
                            <h3 className="font-black text-xl mb-3 tracking-tight uppercase group-hover:text-primary transition-colors">{team.name}</h3>
                            <p className="text-sm text-muted-foreground mb-6 line-clamp-3 leading-relaxed">
                                {team.description || `Be a part of our ${team.name} serving team and make a difference.`}
                            </p>
                            <Button onClick={() => handleTeamSelect(team)} className="w-full rounded-full font-bold uppercase tracking-widest text-xs h-10">
                                Volunteer Now
                                <Heart className="ml-2 h-3.5 w-3.5" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            {step === "CHOOSE_METHOD" && (
                <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-black uppercase tracking-tight">Step 2: Who are you?</h2>
                        <p className="text-muted-foreground italic">Signing up for {selectedTeam?.name}</p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                        <div 
                            onClick={() => setStep("SEARCH")}
                            className="p-8 rounded-2xl border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all text-center group"
                        >
                            <User className="h-10 w-10 mx-auto text-muted-foreground group-hover:text-primary mb-4 transition-colors" />
                            <h3 className="font-bold text-lg mb-2">I've been here before</h3>
                            <p className="text-sm text-muted-foreground">Search for your check-in profile</p>
                        </div>
                        
                        <div 
                            onClick={() => setStep("FORM")}
                            className="p-8 rounded-2xl border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all text-center group"
                        >
                            <Sparkles className="h-10 w-10 mx-auto text-muted-foreground group-hover:text-primary mb-4 transition-colors" />
                            <h3 className="font-bold text-lg mb-2">I'm new here</h3>
                            <p className="text-sm text-muted-foreground">Fill in a quick contact form</p>
                        </div>
                    </div>
                </div>
            )}

            {step === "SEARCH" && (
                <div className="max-w-md mx-auto space-y-8 animate-in slide-in-from-right-4 duration-300">
                    <div className="text-center">
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Find Your Record</h2>
                        <p className="text-sm text-muted-foreground">Enter your name or phone number below</p>
                    </div>

                    <form onSubmit={handleSearch} className="space-y-4">
                        <div className="relative">
                            <Input 
                                placeholder="Search Name or Phone..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-12 pl-12 rounded-xl"
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        </div>
                        <Button type="submit" className="w-full h-12 rounded-xl" disabled={loading}>
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Search"}
                        </Button>
                    </form>

                    <div className="space-y-3">
                        {searchResults && searchResults.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                No records found. Maybe <button onClick={() => setStep("FORM")} className="text-primary underline font-bold">try the new form?</button>
                            </div>
                        )}
                        {searchResults?.map(member => (
                            <button 
                                key={member.id}
                                onClick={() => handleJoinWithMemberId(member.id)}
                                disabled={submitting}
                                className="w-full flex items-center justify-between p-4 rounded-xl border bg-card hover:border-primary transition-all text-left"
                            >
                                <div>
                                    <p className="font-bold">{member.firstName} {member.lastName}</p>
                                    <p className="text-xs text-muted-foreground">{member.phone}</p>
                                </div>
                                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {step === "FORM" && (
                <div className="max-w-md mx-auto space-y-8 animate-in slide-in-from-right-4 duration-300">
                    <div className="text-center">
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Quick Sign-up</h2>
                        <p className="text-sm text-muted-foreground">Just the basics so we can get in touch</p>
                    </div>

                    <form onSubmit={handleJoinWithForm} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>First Name</Label>
                                <Input required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <Label>Last Name</Label>
                                <Input required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Phone Number</Label>
                            <Input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label>Email (Optional)</Label>
                            <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                        </div>
                        <Button type="submit" className="w-full h-12 rounded-xl text-lg font-bold" disabled={submitting}>
                            {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Complete Sign-up"}
                        </Button>
                    </form>
                </div>
            )}
        </div>
    );
}
