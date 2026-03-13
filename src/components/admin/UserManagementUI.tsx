"use client";

import { useActionState, useState, useEffect } from "react";
import { createAdminUserAction, deleteUserAction, updateUserRoleAction } from "@/app/actions/admin-users";
import { 
    UserPlus, 
    Trash2, 
    Shield, 
    Mail, 
    User as UserIcon, 
    CheckCircle, 
    Clock, 
    Copy, 
    Check,
    AlertCircle,
    X
} from "lucide-react";

interface User {
    id: string;
    name: string | null;
    email: string;
    role: string;
    setupRequired: boolean;
    createdAt: Date;
}

interface UserManagementUIProps {
    users: User[];
    currentUserEmail: string;
}

export function UserManagementUI({ users, currentUserEmail }: UserManagementUIProps) {
    const [createState, createAction, isCreating] = useActionState(createAdminUserAction, null);
    const [deleteState, deleteAction, isDeleting] = useActionState(deleteUserAction, null);
    const [updateState, updateAction, isUpdating] = useActionState(updateUserRoleAction, null);
    
    const [copiedCode, setCopiedCode] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
    };

    // Auto-hide success message or scroll to it
    useEffect(() => {
        if (createState?.success) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [createState]);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
                    <p className="text-muted-foreground mt-1">Manage evangelists, admins, and staff members.</p>
                </div>
                {!showAddForm && (
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-primary/90 transition-all"
                    >
                        <UserPlus className="h-4 w-4" />
                        Add Member
                    </button>
                )}
            </div>

            {/* Error Messages for Delete/Update */}
            {(deleteState?.error || updateState?.error) && (
                <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-xl border border-destructive/20 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {deleteState?.error || updateState?.error}
                </div>
            )}

            {/* Success Message for Created User */}
            {createState?.success && createState.tempCode && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-emerald-900 animate-in fade-in slide-in-from-top-4">
                    <div className="flex items-start gap-4">
                        <div className="bg-emerald-100 p-2 rounded-full">
                            <CheckCircle className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold">User Created Successfully!</h3>
                            <p className="text-emerald-700 mt-1">
                                Share this temporary code with the user. They will be prompted to set their own password upon first login.
                            </p>
                            <div className="mt-4 flex items-center gap-4">
                                <div className="bg-white border-2 border-dashed border-emerald-300 px-6 py-3 rounded-lg text-2xl font-mono tracking-[0.5em] font-black text-emerald-600">
                                    {createState.tempCode}
                                </div>
                                <button
                                    onClick={() => copyToClipboard(createState.tempCode!)}
                                    className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                                >
                                    {copiedCode ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    {copiedCode ? "Copied!" : "Copy Code"}
                                </button>
                            </div>
                            <p className="text-emerald-600/70 mt-3 text-sm italic">
                                * The user will be redirected to the secure portal immediately after login with this code.
                            </p>
                        </div>
                        <button onClick={() => window.location.reload()} className="text-emerald-400 hover:text-emerald-600">
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            )}

            {/* Add Member Form */}
            {showAddForm && (
                 <div className="bg-card border rounded-xl p-6 shadow-sm animate-in slide-in-from-top-4">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <UserPlus className="h-5 w-5 text-primary" />
                            Create New Account
                        </h2>
                        <button 
                            onClick={() => setShowAddForm(false)}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    <form action={createAction} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Full Name</label>
                            <input
                                name="name"
                                type="text"
                                required
                                className="w-full bg-transparent border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                                placeholder="e.g. John Smith"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email Address</label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="w-full bg-transparent border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                                placeholder="john@example.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Role / Permissions</label>
                            <select
                                name="role"
                                className="w-full bg-transparent border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                            >
                                <option value="MEMBER">Evangelist (Member Portal)</option>
                                <option value="REGISTRY_CLERK">Registry Clerk</option>
                                <option value="CONTENT_EDITOR">Content Editor</option>
                                <option value="FINANCE_ADMIN">Finance Admin</option>
                                <option value="SUPER_ADMIN">Admin (Full Access)</option>
                            </select>
                        </div>
                        <div className="md:col-span-3 flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowAddForm(false)}
                                className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={isCreating}
                                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-primary/90 disabled:opacity-50 transition-all font-bold"
                            >
                                {isCreating ? "Creating..." : "Generate Access Code"}
                            </button>
                        </div>
                        {createState?.error && (
                            <div className="md:col-span-3 bg-destructive/10 text-destructive text-sm p-3 rounded-lg flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                {createState.error}
                            </div>
                        )}
                    </form>
                </div>
            )}

            {/* Users List */}
            <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead className="bg-muted/50 border-b">
                            <tr>
                                <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">User</th>
                                <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">Role</th>
                                <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">Status</th>
                                <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">Joined</th>
                                <th className="text-right py-4 px-6 text-sm font-semibold text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                {user.name?.[0] || user.email[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-foreground">{user.name || "Unnamed User"}</div>
                                                <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Mail className="h-3 w-3" />
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <form action={updateAction} className="flex items-center gap-2">
                                            <input type="hidden" name="id" value={user.id} />
                                            <Shield className={`h-4 w-4 ${user.role === 'SUPER_ADMIN' ? 'text-primary' : 'text-muted-foreground'}`} />
                                            <select 
                                                name="role" 
                                                defaultValue={user.role}
                                                onChange={(e) => e.target.form?.requestSubmit()}
                                                disabled={user.email === currentUserEmail}
                                                className="bg-transparent text-sm font-medium focus:ring-0 border-none p-0 cursor-pointer hover:underline disabled:cursor-not-allowed"
                                            >
                                                <option value="MEMBER">Evangelist</option>
                                                <option value="REGISTRY_CLERK">Registry Clerk</option>
                                                <option value="CONTENT_EDITOR">Content Editor</option>
                                                <option value="FINANCE_ADMIN">Finance Admin</option>
                                                <option value="SUPER_ADMIN">Admin</option>
                                            </select>
                                        </form>
                                    </td>
                                    <td className="py-4 px-6">
                                        {user.setupRequired ? (
                                            <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-full w-fit border border-amber-100">
                                                <Clock className="h-3 w-3" />
                                                Pending Setup
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full w-fit border border-emerald-100">
                                                <CheckCircle className="h-3 w-3" />
                                                Active
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-4 px-6 text-sm text-muted-foreground">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {user.email !== currentUserEmail && (
                                                <form 
                                                    action={deleteAction}
                                                    onSubmit={(e) => {
                                                        if (!confirm("Are you sure you want to remove this member? They will lose all access immediately.")) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                >
                                                    <input type="hidden" name="id" value={user.id} />
                                                    <button 
                                                        disabled={isDeleting}
                                                        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50"
                                                        title="Remove Member"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </form>
                                            )}
                                        </div>
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
