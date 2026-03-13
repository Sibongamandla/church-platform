"use client";

import { useActionState } from "react";
import { setupPasswordAction } from "@/app/actions/auth";
import { Loader2, Lock, ShieldCheck } from "lucide-react";

export default function SetupPasswordPage() {
    const [state, action, isPending] = useActionState(setupPasswordAction, null);

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-background p-10 shadow-xl border border-primary/10">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                        <Lock className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-3xl font-black tracking-tighter text-foreground decoration-primary decoration-4">
                        Secure Your Account
                    </h2>
                    <p className="mt-4 text-muted-foreground leading-relaxed">
                        Welcome to the team! For security, please set a password for your account to continue.
                    </p>
                </div>

                <form action={action} className="mt-10 space-y-6">
                    {state?.error && (
                        <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive font-bold text-center border border-destructive/20 animate-in shake-in">
                            {state.error}
                        </div>
                    )}

                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4" />
                                New Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                minLength={6}
                                className="block w-full rounded-xl border border-input bg-muted/30 px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all placeholder:text-muted-foreground"
                                placeholder="Min. 6 characters"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="text-sm font-semibold text-foreground">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                minLength={6}
                                className="block w-full rounded-xl border border-input bg-muted/30 px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full flex justify-center items-center rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isPending && <Loader2 className="mr-3 h-5 w-5 animate-spin" />}
                        {isPending ? "Setting up..." : "Complete Account Setup"}
                    </button>
                    
                    <p className="text-center text-xs text-muted-foreground uppercase tracking-widest font-semibold pt-4">
                        Church Platform Security
                    </p>
                </form>
            </div>
        </div>
    );
}
