"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, UserPlus, Plus, Trash2 } from "lucide-react";
import { registerVisitorAction } from "@/app/actions/attendance";

export function VisitorRegisterForm({ recruiterSlug }: { recruiterSlug?: string }) {
    const [loading, setLoading] = useState(false);
    const [familyMembers, setFamilyMembers] = useState<{ id: number, firstName: string, lastName: string, gender: string, birthday: string }[]>([]);

    const addFamilyMember = () => {
        setFamilyMembers([
            ...familyMembers,
            { id: Date.now(), firstName: "", lastName: "", gender: "", birthday: "" }
        ]);
    };

    const removeFamilyMember = (id: number) => {
        setFamilyMembers(familyMembers.filter(m => m.id !== id));
    };

    const updateFamilyMember = (id: number, field: string, value: string) => {
        setFamilyMembers(familyMembers.map(m => m.id === id ? { ...m, [field]: value } : m));
    };

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        if (familyMembers.length > 0) {
            formData.append("familyMembersJSON", JSON.stringify(familyMembers));
        }
        await registerVisitorAction(formData);
        setLoading(false);
    }

    return (
        <form action={handleSubmit} className="space-y-6">
            <input type="hidden" name="recruiterSlug" value={recruiterSlug || ""} />
            
            <div className="space-y-4">
                <h3 className="font-bold text-lg border-b pb-2">Your Details</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" name="firstName" required placeholder="Jane" disabled={loading} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" name="lastName" required placeholder="Doe" disabled={loading} />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" type="tel" required placeholder="082 123 4567" disabled={loading} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <select
                            id="gender"
                            name="gender"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={loading}
                            required
                        >
                            <option value="" disabled selected>Select...</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="birthday">Date of Birth</Label>
                        <Input
                            id="birthday"
                            name="birthday"
                            type="date"
                            required
                            disabled={loading}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input id="email" name="email" type="email" placeholder="jane@example.com" disabled={loading} />
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg">Family Members <span className="text-sm font-normal text-muted-foreground">(Optional)</span></h3>
                    <Button type="button" variant="outline" size="sm" onClick={addFamilyMember} disabled={loading} className="rounded-full">
                        <Plus className="h-4 w-4 mr-1" /> Add Person
                    </Button>
                </div>

                {familyMembers.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic bg-muted/30 p-4 rounded-xl text-center">
                        Checking in with family? Add them here to register and check them in all at once.
                    </p>
                ) : (
                    <div className="space-y-4">
                        {familyMembers.map((member, index) => (
                            <div key={member.id} className="relative p-4 border rounded-xl bg-card space-y-4 animate-fade-in">
                                <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="icon" 
                                    className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-destructive/10 text-destructive hover:bg-destructive hover:text-white"
                                    onClick={() => removeFamilyMember(member.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>First Name</Label>
                                        <Input 
                                            value={member.firstName} 
                                            onChange={(e) => updateFamilyMember(member.id, "firstName", e.target.value)} 
                                            required 
                                            placeholder="John" 
                                            disabled={loading} 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Last Name (Optional)</Label>
                                        <Input 
                                            value={member.lastName} 
                                            onChange={(e) => updateFamilyMember(member.id, "lastName", e.target.value)} 
                                            placeholder="Defaults to yours" 
                                            disabled={loading} 
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Gender</Label>
                                        <select
                                            value={member.gender}
                                            onChange={(e) => updateFamilyMember(member.id, "gender", e.target.value)}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                            disabled={loading}
                                        >
                                            <option value="" disabled>Select...</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Date of Birth</Label>
                                        <Input
                                            type="date"
                                            value={member.birthday}
                                            onChange={(e) => updateFamilyMember(member.id, "birthday", e.target.value)}
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Button className="w-full rounded-full h-12 text-lg" type="submit" disabled={loading}>
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing...
                    </>
                ) : (
                    <>
                        <UserPlus className="mr-2 h-5 w-5" />
                        Complete Registration
                    </>
                )}
            </Button>
        </form>
    );
}
