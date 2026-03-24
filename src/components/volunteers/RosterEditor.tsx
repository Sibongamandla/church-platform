"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { scheduleVolunteerAction, updateAssignmentStatusAction } from "@/app/actions/volunteers";
import { Loader2, UserPlus, CheckCircle, Clock, XCircle } from "lucide-react";

type Member = { id: string; firstName: string; lastName: string };
type TeamRole = { id: string; name: string; team: { name: string } };
type Assignment = { id: string; status: string; member: Member; role: TeamRole };

// We use simplified types for the editor props
type TeamMember = { id: string; member: Member; roleId: string | null };
type Team = { id: string; name: string; roles: { id: string, name: string }[]; members: TeamMember[] };

export function RosterEditor({ 
    sessionId,
    scheduleId,
    assignments,
    teams,
    linkedTeamIds = []
}: { 
    sessionId: string;
    scheduleId?: string;
    assignments: Assignment[];
    teams: Team[];
    linkedTeamIds?: string[];
}) {
    const [loading, setLoading] = useState(false);
    
    // Filter teams to show only linked ones
    const displayTeams = linkedTeamIds.length > 0
        ? teams.filter(t => linkedTeamIds.includes(t.id))
        : teams;

    const [selectedTeam, setSelectedTeam] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [selectedMember, setSelectedMember] = useState("");

    const activeTeam = displayTeams.find(t => t.id === selectedTeam);
    const activeMembers = activeTeam?.members || [];
    const activeRoles = activeTeam?.roles || [];

    async function handleAssign() {
        if (!scheduleId || !selectedMember || !selectedRole) {
            alert("Ensure schedule exists and member/role are selected");
            return;
        }

        setLoading(true);
        await scheduleVolunteerAction(scheduleId, selectedMember, selectedRole);
        setSelectedMember("");
        setLoading(false);
    }

    async function handleStatusChange(assignmentId: string, status: "PENDING"| "CONFIRMED" | "DECLINED") {
        setLoading(true);
        await updateAssignmentStatusAction(assignmentId, status);
        setLoading(false);
    }

    return (
        <div className="space-y-8">
            <div className="rounded-xl border bg-card p-6">
                <h3 className="text-lg font-semibold mb-4">Assign Volunteer</h3>
                
                {scheduleId ? (
                    <div className="grid md:grid-cols-4 gap-4 items-end">
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

                        <Button onClick={handleAssign} disabled={!selectedMember || !selectedRole || loading} className="w-full">
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4 mr-2" />}
                            Schedule
                        </Button>
                    </div>
                ) : (
                    <div className="text-sm text-yellow-600 bg-yellow-500/10 p-4 rounded-lg">
                        Cannot assign volunteers: No Schedule Record exists for this session yet. 
                        (In a full implementation, this would auto-create).
                    </div>
                )}
            </div>

            <div className="rounded-xl border bg-card p-6">
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
                                    <th className="px-4 py-3 font-medium">Status</th>
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
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1">
                                                {a.status === "CONFIRMED" && <><CheckCircle className="h-4 w-4 text-green-500" /> Confirmed</>}
                                                {a.status === "PENDING" && <><Clock className="h-4 w-4 text-yellow-500" /> Pending</>}
                                                {a.status === "DECLINED" && <><XCircle className="h-4 w-4 text-red-500" /> Declined</>}
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
