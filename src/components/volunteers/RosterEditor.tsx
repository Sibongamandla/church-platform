"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { scheduleVolunteerAction, updateAssignmentStatusAction } from "@/app/actions/volunteers";
import { Loader2, UserPlus, CheckCircle, Clock, XCircle, Timer, MessageSquare, Mail } from "lucide-react";
import { useSearchParams } from "next/navigation";

type Member = { id: string; firstName: string; lastName: string; phone?: string | null; email?: string | null };
type TeamRole = { id: string; name: string; team: { name: string } };
type Assignment = { id: string; status: string; member: Member; role: TeamRole; callTime?: string | null };

type Team = {
    id: string;
    name: string;
    roles: TeamRole[];
    members: { member: Member }[];
};

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
    const searchParams = useSearchParams();
    const preselectedTeamId = searchParams.get("teamId");

    const [loading, setLoading] = useState(false);
    const [selectedTeamId, setSelectedTeamId] = useState<string>(preselectedTeamId || linkedTeamIds[0] || "");
    const [selectedRoleId, setSelectedRoleId] = useState<string>("");
    const [selectedMemberId, setSelectedMemberId] = useState<string>("");
    const [callTime, setCallTime] = useState("");
    const [baseUrl, setBaseUrl] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            setBaseUrl(window.location.origin);
        }
    }, []);

    useEffect(() => {
        if (preselectedTeamId) {
            setSelectedTeamId(preselectedTeamId);
        }
    }, [preselectedTeamId]);

    const filteredTeams = teams.filter(t => linkedTeamIds.includes(t.id));
    const selectedTeam = teams.find(t => t.id === selectedTeamId);
    const teamMembers = selectedTeam?.members.map(m => m.member) || [];

    async function handleSchedule() {
        if (!selectedTeamId || !selectedRoleId || !selectedMemberId) return;
        setLoading(true);
        await scheduleVolunteerAction({
            sessionId,
            scheduleId,
            memberId: selectedMemberId,
            roleId: selectedRoleId,
            callTime
        });
        setLoading(false);
        // Clear selection after scheduling
        setSelectedMemberId("");
        setCallTime("");
    }

    async function handleStatusChange(assignmentId: string, status: "PENDING"| "CONFIRMED" | "DECLINED") {
        setLoading(true);
        await updateAssignmentStatusAction(assignmentId, status);
        setLoading(false);
    }

    const generateWhatsAppLink = (a: Assignment) => {
        const url = `${baseUrl}/volunteer/confirm/${a.id}`;
        const message = `Hi ${a.member.firstName}, you've been scheduled for ${sessionName} on ${sessionDate} as ${a.role.name}. Your call time is ${a.callTime || 'the start of service'}. Please confirm here: ${url}`;
        return `https://wa.me/${a.member.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    }

    const generateEmailLink = (a: Assignment) => {
        const url = `${baseUrl}/volunteer/confirm/${a.id}`;
        const subject = `Service Roster: ${sessionName}`;
        const body = `Hi ${a.member.firstName},\n\nYou've been scheduled to serve as ${a.role.name} for our ${sessionName} on ${sessionDate}.\n\nYour call time is ${a.callTime || 'the start of service'}.\n\nPlease confirm your availability here: ${url}\n\nThank you!`;
        return `mailto:${a.member.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }

    return (
        <div className="space-y-8">
            <div className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <UserPlus className="h-5 w-5 text-primary" />
                        Schedule Volunteer
                    </h2>
                    <Button variant="ghost" size="sm" onClick={() => {
                        setSelectedRoleId("");
                        setSelectedMemberId("");
                        setCallTime("");
                    }}>Clear Selection</Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Team</label>
                        <select 
                            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={selectedTeamId}
                            onChange={(e) => {
                                setSelectedTeamId(e.target.value);
                                setSelectedRoleId("");
                                setSelectedMemberId("");
                            }}
                        >
                            <option value="">Select Team</option>
                            {filteredTeams.map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Role</label>
                        <select 
                            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={selectedRoleId}
                            onChange={(e) => setSelectedRoleId(e.target.value)}
                            disabled={!selectedTeamId}
                        >
                            <option value="">Select Role</option>
                            {selectedTeam?.roles.map(r => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Volunteer</label>
                        <select 
                            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={selectedMemberId}
                            onChange={(e) => setSelectedMemberId(e.target.value)}
                            disabled={!selectedRoleId}
                        >
                            <option value="">Select Member</option>
                            {teamMembers.map(m => (
                                <option key={m.id} value={m.id}>{m.firstName} {m.lastName}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Call Time (Optional)</label>
                        <input 
                            type="time"
                            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={callTime}
                            onChange={(e) => setCallTime(e.target.value)}
                        />
                    </div>

                    <Button 
                        onClick={handleSchedule} 
                        disabled={loading || !selectedMemberId}
                        className="md:col-start-4 h-10"
                    >
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Schedule"}
                    </Button>
                </div>
            </div>

            <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                        <tr>
                            <th className="px-4 py-3 text-left font-medium">Volunteer</th>
                            <th className="px-4 py-3 text-left font-medium">Role</th>
                            <th className="px-4 py-3 text-left font-medium">Call Time</th>
                            <th className="px-4 py-3 text-left font-medium">Status</th>
                            <th className="px-4 py-3 text-left font-medium">Notify</th>
                            <th className="px-4 py-3 text-right font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {assignments.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground italic">
                                    No volunteers scheduled yet.
                                </td>
                            </tr>
                        ) : (
                            assignments.map((a) => (
                                <tr key={a.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-4 py-3 font-medium">
                                        {a.member.firstName} {a.member.lastName}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {a.role.name}
                                    </td>
                                    <td className="px-4 py-3">
                                        {a.callTime ? (
                                            <div className="flex items-center gap-1.5 text-primary font-medium">
                                                <Timer className="h-3.5 w-3.5" />
                                                {a.callTime}
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground text-xs italic">Service Start</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            {a.status === "PENDING" && <><Clock className="h-4 w-4 text-orange-500" /> Pending</>}
                                            {a.status === "CONFIRMED" && <><CheckCircle className="h-4 w-4 text-green-500" /> Confirmed</>}
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
                                            <Button 
                                                size="sm" 
                                                variant="outline" 
                                                className="h-8 text-green-600 border-green-200 hover:bg-green-50"
                                                onClick={() => handleStatusChange(a.id, "CONFIRMED")}
                                                disabled={loading || a.status === "CONFIRMED"}
                                            >
                                                Confirm
                                            </Button>
                                            <Button 
                                                size="sm" 
                                                variant="outline" 
                                                className="h-8 text-red-600 border-red-200 hover:bg-red-50"
                                                onClick={() => handleStatusChange(a.id, "DECLINED")}
                                                disabled={loading || a.status === "DECLINED"}
                                            >
                                                Decline
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
