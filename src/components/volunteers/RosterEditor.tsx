"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { scheduleVolunteerAction, updateAssignmentStatusAction } from "@/app/actions/volunteers";
import { Loader2, UserPlus, CheckCircle, Clock, XCircle, Timer, MessageSquare, Mail } from "lucide-react";
import { useSearchParams } from "next/navigation";

type Member = { id: string; firstName: string; lastName: string; phone?: string | null; email?: string | null };
type TeamRole = { id: string; name: string; team: { name: string } };
type Assignment = { id: string; status: string; member: Member; role: TeamRole; callTime?: string | null };

// We use simplified types for the editor props
type TeamMember = { id: string; member: Member; roleId: string | null };
type Team = { id: string; name: string; roles: { id: string, name: string }[]; members: TeamMember[] };

export function RosterEditor({ 
    sessionId,
    sessionName,
    sessionDate,
    scheduleId,
    assignments,
    teams,
    linkedTeamIds = []
}: { 
    sessionId: string;
    sessionName: string;
    sessionDate: string;
    scheduleId?: string;
    assignments: Assignment[];
    teams: Team[];
    linkedTeamIds?: string[];
}) {
    const [loading, setLoading] = useState(false);
    const searchParams = useSearchParams();
    
    // Filter teams to show only linked ones
    const displayTeams = linkedTeamIds.length > 0
        ? teams.filter(t => linkedTeamIds.includes(t.id))
        : teams;

    const [selectedTeam, setSelectedTeam] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [selectedMember, setSelectedMember] = useState("");
    const [callTime, setCallTime] = useState("");

    // Pre-selection logic
    useEffect(() => {
        const teamIdParam = searchParams.get("teamId");
        if (teamIdParam && teams.some(t => t.id === teamIdParam)) {
            setSelectedTeam(teamIdParam);
        }
    }, [searchParams, teams]);

    const activeTeam = displayTeams.find(t => t.id === selectedTeam);
    const activeMembers = activeTeam?.members || [];
    const activeRoles = activeTeam?.roles || [];

    async function handleAssign() {
        if (!scheduleId || !selectedMember || !selectedRole) {
            alert("Ensure schedule exists and member/role are selected");
            return;
        }

        setLoading(true);
        const res = await scheduleVolunteerAction(scheduleId, selectedMember, selectedRole, callTime);
        if (res.success) {
            setSelectedMember("");
            setCallTime("");
        } else {
            alert(res.error || "Failed to schedule volunteer");
        }
        setLoading(false);
    }

    async function handleStatusChange(assignmentId: string, status: "PENDING"| "CONFIRMED" | "DECLINED") {
        setLoading(true);
        await updateAssignmentStatusAction(assignmentId, status);
        setLoading(false);
    }

    const generateWhatsAppLink = (a: Assignment) => {
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        const confirmUrl = `${baseUrl}/volunteer/confirm/${a.id}`;
        const message = `Hi ${a.member.firstName}, you've been scheduled for ${sessionName} on ${sessionDate} as ${a.role.name}. Your call time is ${a.callTime || 'the start of service'}. Please confirm here: ${confirmUrl}`;
        return `https://wa.me/${a.member.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    }

    const generateEmailLink = (a: Assignment) => {
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        const confirmUrl = `${baseUrl}/volunteer/confirm/${a.id}`;
        const subject = `Service Roster: ${sessionName}`;
        const body = `Hi ${a.member.firstName},\n\nYou've been scheduled to serve as ${a.role.name} for our ${sessionName} on ${sessionDate}.\n\nYour call time is ${a.callTime || 'the start of service'}.\n\nPlease confirm your availability here: ${confirmUrl}\n\nThank you!`;
        return `mailto:${a.member.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }

    return (
        <div className="space-y-8">
            <div className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Assign Volunteer</h3>
                    {selectedTeam && (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground"
                            onClick={() => {
                                setSelectedTeam("");
                                setSelectedRole("");
                                setSelectedMember("");
                            }}
                        >
                            Clear Selection
                        </Button>
                    )}
                </div>
                
                {scheduleId ? (
                    <div className="grid md:grid-cols-5 gap-4 items-end">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Team</label>
                            <select 
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={selectedTeam}
                                onChange={(e) => {
                                    setSelectedTeam(e.target.value);
                                    setSelectedRole("");
                                    setSelectedMember("");
                                }}
                                disabled={loading}
                            >
                                <option value="">Select Team...</option>
                                {displayTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Role</label>
                            <select 
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                disabled={!selectedTeam || loading}
                            >
                                <option value="">Select Role...</option>
                                {activeRoles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Team Member</label>
                            <select 
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={selectedMember}
                                onChange={(e) => setSelectedMember(e.target.value)}
                                disabled={!selectedTeam || loading}
                            >
                                <option value="">Select Member...</option>
                                {activeMembers.map(m => (
                                    <option key={m.member.id} value={m.member.id}>
                                        {m.member.firstName} {m.member.lastName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Call Time (Arrival)</label>
                            <input 
                                type="time"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={callTime}
                                onChange={(e) => setCallTime(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <Button onClick={handleAssign} disabled={!selectedMember || !selectedRole || loading} className="w-full">
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4 mr-2" />}
                            Schedule
                        </Button>
                    </div>
                ) : (
                    <div className="text-sm text-yellow-600 bg-yellow-500/10 p-4 rounded-lg">
                        Cannot assign volunteers: No Schedule Record exists for this session yet.
                    </div>
                )}
            </div>

            <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Current Roster</h3>
                {assignments.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic text-center py-6">No volunteers assigned.</p>
                ) : (
                    <div className="overflow-hidden rounded-md border">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Volunteer</th>
                                    <th className="px-4 py-3 font-medium">Role</th>
                                    <th className="px-4 py-3 font-medium">Call Time</th>
                                    <th className="px-4 py-3 font-medium">Status</th>
                                    <th className="px-4 py-3 font-medium">Notify</th>
                                    <th className="px-4 py-3 font-medium text-right">Update Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {assignments.map(a => (
                                    <tr key={a.id} className="hover:bg-muted/50">
                                        <td className="px-4 py-3 font-medium">
                                            {a.member.firstName} {a.member.lastName}
                                        </td>
                                        <td className="px-4 py-3">
                                            {a.role.team.name} • {a.role.name}
                                        </td>
                                        <td className="px-4 py-3 font-medium text-primary">
                                            {a.callTime ? (
                                                <div className="flex items-center gap-1.5">
                                                    <Timer className="h-3.5 w-3.5" />
                                                    {a.callTime}
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground font-normal italic">Not set</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1">
                                                {a.status === "CONFIRMED" && <><CheckCircle className="h-4 w-4 text-green-500" /> Confirmed</>}
                                                {a.status === "PENDING" && <><Clock className="h-4 w-4 text-yellow-500" /> Pending</>}
                                                {a.status === "DECLINED" && <><XCircle className="h-4 w-4 text-red-500" /> Declined</>}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                {a.member.phone && (
                                                    <a 
                                                        href={generateWhatsAppLink(a)} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="p-2 rounded-full hover:bg-green-50 text-green-600 transition-colors"
                                                        title="Notify via WhatsApp"
                                                    >
                                                        <MessageSquare className="h-4 w-4" />
                                                    </a>
                                                )}
                                                {a.member.email && (
                                                    <a 
                                                        href={generateEmailLink(a)} 
                                                        className="p-2 rounded-full hover:bg-blue-50 text-blue-600 transition-colors"
                                                        title="Notify via Email"
                                                    >
                                                        <Mail className="h-4 w-4" />
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50" onClick={() => handleStatusChange(a.id, "CONFIRMED")} disabled={loading || a.status === "CONFIRMED"}>Confirm</Button>
                                                <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleStatusChange(a.id, "DECLINED")} disabled={loading || a.status === "DECLINED"}>Decline</Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
