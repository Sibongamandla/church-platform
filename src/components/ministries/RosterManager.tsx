"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { addGroupMemberAction, removeGroupMemberAction, updateGroupMemberRoleAction } from "@/app/actions/ministries";
import { Loader2, Plus, Shield, UserMinus, UserCheck } from "lucide-react";

type Member = { id: string; firstName: string; lastName: string; email: string | null };
type GroupMember = { id: string; role: string; member: Member };

export function RosterManager({ 
    groupId, 
    currentMembers, 
    allMembers 
}: { 
    groupId: string; 
    currentMembers: GroupMember[]; 
    allMembers: Member[];
}) {
    const [loading, setLoading] = useState(false);
    const [selectedMember, setSelectedMember] = useState("");

    const availableMembers = allMembers.filter(
        (m) => !currentMembers.find((cm) => cm.member.id === m.id)
    );

    async function handleAddMember() {
        if (!selectedMember) return;
        setLoading(true);
        await addGroupMemberAction(groupId, selectedMember, "MEMBER");
        setSelectedMember("");
        setLoading(false);
    }

    async function handleRemove(memberId: string) {
        if (confirm("Remove this person from the group?")) {
            setLoading(true);
            await removeGroupMemberAction(groupId, memberId);
            setLoading(false);
        }
    }

    async function handleToggleRole(memberId: string, currentRole: string) {
        setLoading(true);
        const newRole = currentRole === "LEADER" ? "MEMBER" : "LEADER";
        await updateGroupMemberRoleAction(groupId, memberId, newRole);
        setLoading(false);
    }

    return (
        <div className="space-y-6">
            <div className="flex gap-4 p-4 border rounded-xl bg-card">
                <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={selectedMember}
                    onChange={(e) => setSelectedMember(e.target.value)}
                    disabled={loading}
                >
                    <option value="">Select a member to add...</option>
                    {availableMembers.map((m) => (
                        <option key={m.id} value={m.id}>
                            {m.firstName} {m.lastName} {m.email ? `(${m.email})` : ''}
                        </option>
                    ))}
                </select>
                <Button onClick={handleAddMember} disabled={!selectedMember || loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                    Add
                </Button>
            </div>

            <div className="border rounded-xl bg-card overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted">
                        <tr>
                            <th className="px-4 py-3 font-medium">Name</th>
                            <th className="px-4 py-3 font-medium">Role</th>
                            <th className="px-4 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {currentMembers.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                                    No members in this group yet.
                                </td>
                            </tr>
                        ) : currentMembers.map((gm) => (
                            <tr key={gm.id} className="hover:bg-muted/50">
                                <td className="px-4 py-3">
                                    <div className="font-medium">{gm.member.firstName} {gm.member.lastName}</div>
                                    <div className="text-xs text-muted-foreground">{gm.member.email}</div>
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${gm.role === 'LEADER' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary-foreground'}`}>
                                        {gm.role === 'LEADER' && <Shield className="w-3 h-3 mr-1" />}
                                        {gm.role}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleToggleRole(gm.member.id, gm.role)}
                                        disabled={loading}
                                    >
                                        <UserCheck className="w-4 h-4 mr-2" />
                                        {gm.role === 'LEADER' ? 'Make Member' : 'Make Leader'}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                        onClick={() => handleRemove(gm.member.id)}
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
    );
}
