"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { linkTeamToSessionAction, unlinkTeamFromSessionAction } from "@/app/actions/volunteers";
import { Loader2, Plus, Calendar, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

type Session = { id: string; name: string; date: Date };

export function TeamSessionLinker({ 
    teamId, 
    upcomingSessions, 
    linkedSessionIds 
}: { 
    teamId: string; 
    upcomingSessions: Session[]; 
    linkedSessionIds: string[];
}) {
    const [loading, setLoading] = useState(false);
    const [selectedSession, setSelectedSession] = useState("");
    const router = useRouter();

    const availableSessions = upcomingSessions.filter(s => !linkedSessionIds.includes(s.id));
    const linkedSessions = upcomingSessions.filter(s => linkedSessionIds.includes(s.id));

    async function handleLink() {
        if (!selectedSession) return;
        setLoading(true);
        const res = await linkTeamToSessionAction(teamId, selectedSession);
        if (res.success) {
            setSelectedSession("");
            router.refresh();
        } else {
            alert(res.error || "Failed to link session");
        }
        setLoading(false);
    }

    async function handleUnlink(sessionId: string) {
        if (!confirm("Remove this team from this session's roster?")) return;
        setLoading(true);
        const res = await unlinkTeamFromSessionAction(teamId, sessionId);
        if (res.success) {
            router.refresh();
        } else {
            alert(res.error || "Failed to unlink session");
        }
        setLoading(false);
    }

    return (
        <div className="space-y-6">
            <div className="rounded-xl border bg-card p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Assigned Service Sessions
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                    Link this team to specific services to manage their roster and scheduling.
                </p>

                <div className="flex gap-4 mb-8">
                    <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={selectedSession}
                        onChange={(e) => setSelectedSession(e.target.value)}
                        disabled={loading || availableSessions.length === 0}
                    >
                        <option value="">{availableSessions.length === 0 ? "No more upcoming sessions" : "Select an upcoming service..."}</option>
                        {availableSessions.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.name} ({new Date(s.date).toLocaleDateString()})
                            </option>
                        ))}
                    </select>
                    <Button onClick={handleLink} disabled={!selectedSession || loading} className="shrink-0">
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                        Link Session
                    </Button>
                </div>

                <div className="space-y-3">
                    {linkedSessions.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-xl">
                            This team isn't assigned to any upcoming services yet.
                        </div>
                    ) : (
                        linkedSessions.map(s => (
                            <div key={s.id} className="flex items-center justify-between p-4 rounded-xl border bg-muted/30 group">
                                <div>
                                    <p className="font-bold">{s.name}</p>
                                    <p className="text-xs text-muted-foreground">{new Date(s.date).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="h-8 transition-all hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                                        onClick={() => router.push(`/admin/volunteers/roster/${s.id}?teamId=${teamId}`)}
                                    >
                                        Schedule Roster
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="text-destructive h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => handleUnlink(s.id)}
                                        disabled={loading}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
