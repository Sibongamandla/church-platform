"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createTeamRoleAction, assignTeamMemberAction, removeTeamMemberAction } from "@/app/actions/volunteers";
import { Loader2, Plus, UserMinus } from "lucide-react";

type Member = { id: string; firstName: string; lastName: string; email: string | null };
type TeamRole = { id: string; name: string };
type TeamMember = { id: string; roleId: string | null; member: Member; role?: TeamRole | null };

export function TeamManager({ 
    teamId, 
    currentMembers, 
    allMembers,
    roles 
}: { 
    teamId: string; 
    currentMembers: TeamMember[]; 
    allMembers: Member[];
    roles: TeamRole[];
}) {
    const [loading, setLoading] = useState(false);
    const [selectedMember, setSelectedMember] = useState("");
    const [selectedRoleForAdd, setSelectedRoleForAdd] = useState("");
    const [newRoleName, setNewRoleName] = useState("");

    const availableMembers = allMembers.filter(
        (m) => !currentMembers.find((cm) => cm.member.id === m.id)
    );

    async function handleAddRole() {
        if (!newRoleName) return;
        setLoading(true);
        await createTeamRoleAction(teamId, newRoleName);
        setNewRoleName("");
        setLoading(false);
    }

    async function handleAddMember() {
        if (!selectedMember) return;
        setLoading(true);
        await assignTeamMemberAction(teamId, selectedMember, selectedRoleForAdd || undefined);
        setSelectedMember("");
        setSelectedRoleForAdd("");
        setLoading(false);
    }

    async function handleRemove(memberId: string) {
        if (confirm("Remove this person from the team?")) {
            setLoading(true);
            await removeTeamMemberAction(teamId, memberId);
            setLoading(false);
        }
    }

    // Role assignment could be updated in place, but we keep MVP simple
    async function handleRoleChange(memberId: string, roleId: string) {
        setLoading(true);
        await assignTeamMemberAction(teamId, memberId, roleId || undefined);
        setLoading(false);
    }

    return (
        <div className="space-y-8">
            {/* Roles Section */}
            <div className="rounded-xl border bg-card p-6">
                <h3 className="text-lg font-semibold mb-4">Team Roles</h3>
                <div className="flex gap-4 mb-4">
                    <Input 
                        placeholder="New role name (e.g. Lead Vocals, Usher Hub 1)..." 
                        value={newRoleName}
                        onChange={(e) => setNewRoleName(e.target.value)}
                        disabled={loading}
                    />
                    <Button onClick={handleAddRole} disabled={!newRoleName || loading} variant="secondary">
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                        Add Role
                    </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {roles.length === 0 ? <span className="text-sm text-muted-foreground italic">No roles defined.</span> : null}
                    {roles.map(r => (
                        <div key={r.id} className="bg-secondary/20 px-3 py-1.5 rounded-full text-sm font-medium">
                            {r.name}
                        </div>
                    ))}
                </div>
            </div>

            {/* Members Section */}
            <div className="rounded-xl border bg-card p-6">
                <h3 className="text-lg font-semibold mb-4">Team Members</h3>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={selectedMember}
                        onChange={(e) => setSelectedMember(e.target.value)}
                        disabled={loading}
                    >
                        <option value="">Select a member...</option>
                        {availableMembers.map((m) => (
                            <option key={m.id} value={m.id}>
                                {m.firstName} {m.lastName}
                            </option>
                        ))}
                    </select>
                    
                    <select
                        className="flex h-10 w-full sm:w-64 rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={selectedRoleForAdd}
                        onChange={(e) => setSelectedRoleForAdd(e.target.value)}
                        disabled={loading}
                    >
                        <option value="">No Default Role</option>
                        {roles.map((r) => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                    </select>

                    <Button onClick={handleAddMember} disabled={!selectedMember || loading}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                        Add
                    </Button>
                </div>

                <div className="overflow-hidden rounded-md border">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted">
                            <tr>
                                <th className="px-4 py-3 font-medium">Name</th>
                                <th className="px-4 py-3 font-medium">Default Role</th>
                                <th className="px-4 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {currentMembers.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                                        No members in this team yet.
                                    </td>
                                </tr>
                            ) : currentMembers.map((tm) => (
                                <tr key={tm.id} className="hover:bg-muted/50">
                                    <td className="px-4 py-3 font-medium">
                                        {tm.member.firstName} {tm.member.lastName}
                                    </td>
                                    <td className="px-4 py-3">
                                        <select
                                            className="h-8 w-48 rounded-md border-transparent bg-transparent px-2 py-1 text-sm hover:border-input focus:border-input focus:ring-1 focus:ring-ring transition-all"
                                            value={tm.roleId || ""}
                                            onChange={(e) => handleRoleChange(tm.member.id, e.target.value)}
                                            disabled={loading}
                                        >
                                            <option value="">None</option>
                                            {roles.map((r) => (
                                                <option key={r.id} value={r.id}>{r.name}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                            onClick={() => handleRemove(tm.member.id)}
                                            disabled={loading}
                                        >
                                            <UserMinus className="w-4 h-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
