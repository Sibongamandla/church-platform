"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserCheck, UserPlus, ArrowLeft, ChevronRight } from "lucide-react";
import { MemberSearchForm } from "./MemberSearchForm";
import { VisitorRegisterForm } from "./VisitorRegisterForm";
import { motion, AnimatePresence } from "framer-motion";

type ViewState = "welcome" | "member" | "visitor";

export function KioskWrapper({ recruiterSlug }: { recruiterSlug?: string }) {
    const [view, setView] = useState<ViewState>("welcome");

    return (
        <div className="w-full max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
                {view === "welcome" && (
                    <motion.div
                        key="welcome"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-8"
                    >
                        <div className="text-center space-y-4">
                            <h2 className="text-4xl md:text-5xl font-heading font-black text-primary uppercase tracking-tight">
                                Welcome <span className="text-transparent bg-clip-text bg-gradient-to-tr from-yellow-500 to-amber-600">Home</span>
                            </h2>
                            <p className="text-xl text-muted-foreground max-w-lg mx-auto">
                                We are so glad you are here. Please select an option to check in.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <button
                                onClick={() => setView("member")}
                                className="group relative flex flex-col items-center justify-center p-10 h-64 bg-card hover:bg-primary/5 border-2 border-border hover:border-primary rounded-[2.5rem] transition-all duration-300 shadow-sm hover:shadow-xl space-y-6"
                            >
                                <div className="h-20 w-20 rounded-full bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground flex items-center justify-center transition-colors duration-300">
                                    <UserCheck className="h-10 w-10" />
                                </div>
                                <div className="text-center space-y-2">
                                    <h3 className="text-2xl font-bold text-primary font-heading uppercase">I'm a Member</h3>
                                    <p className="text-sm text-muted-foreground font-medium">Search for your record</p>
                                </div>
                                <div className="absolute bottom-6 opacity-0 group-hover:opacity-100 transition-opacity text-primary">
                                    <ChevronRight className="h-6 w-6" />
                                </div>
                            </button>

                            <button
                                onClick={() => setView("visitor")}
                                className="group relative flex flex-col items-center justify-center p-10 h-64 bg-card hover:bg-secondary/20 border-2 border-border hover:border-secondary rounded-[2.5rem] transition-all duration-300 shadow-sm hover:shadow-xl space-y-6"
                            >
                                <div className="h-20 w-20 rounded-full bg-secondary/20 text-secondary-foreground group-hover:bg-secondary group-hover:text-secondary-foreground flex items-center justify-center transition-colors duration-300">
                                    <UserPlus className="h-10 w-10" />
                                </div>
                                <div className="text-center space-y-2">
                                    <h3 className="text-2xl font-bold text-foreground font-heading uppercase">I'm New Here</h3>
                                    <p className="text-sm text-muted-foreground font-medium">Create a new profile</p>
                                </div>
                                <div className="absolute bottom-6 opacity-0 group-hover:opacity-100 transition-opacity text-secondary-foreground">
                                    <ChevronRight className="h-6 w-6" />
                                </div>
                            </button>
                        </div>
                    </motion.div>
                )}

                {view === "member" && (
                    <motion.div
                        key="member"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-card border border-border shadow-xl rounded-[2.5rem] p-8 md:p-12"
                    >
                        <div className="mb-8 flex items-center justify-between">
                            <Button
                                variant="ghost"
                                onClick={() => setView("welcome")}
                                className="pl-0 hover:bg-transparent hover:text-primary text-muted-foreground"
                            >
                                <ArrowLeft className="mr-2 h-5 w-5" />
                                Back to Selection
                            </Button>
                            <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground/50">
                                Member Check-in
                            </span>
                        </div>

                        <div className="space-y-6 max-w-lg mx-auto text-center">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-heading font-black text-primary">Find Your Record</h2>
                                <p className="text-muted-foreground">Enter your name or phone number to search.</p>
                            </div>
                            <div className="text-left">
                                <MemberSearchForm />
                            </div>
                        </div>
                    </motion.div>
                )}

                {view === "visitor" && (
                    <motion.div
                        key="visitor"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-card border border-border shadow-xl rounded-[2.5rem] p-8 md:p-12"
                    >
                        <div className="mb-8 flex items-center justify-between">
                            <Button
                                variant="ghost"
                                onClick={() => setView("welcome")}
                                className="pl-0 hover:bg-transparent hover:text-primary text-muted-foreground"
                            >
                                <ArrowLeft className="mr-2 h-5 w-5" />
                                Back to Selection
                            </Button>
                            <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground/50">
                                First Time Visitor
                            </span>
                        </div>

                        <div className="space-y-6 max-w-lg mx-auto text-center">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-heading font-black text-primary">Welcome!</h2>
                                <p className="text-muted-foreground">Please fill in your details to get started.</p>
                            </div>
                            <div className="text-left">
                                <VisitorRegisterForm recruiterSlug={recruiterSlug} />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
