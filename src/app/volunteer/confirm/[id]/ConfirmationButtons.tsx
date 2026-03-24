"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { updateAssignmentStatusPublicAction } from "@/app/actions/volunteers";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export function ConfirmationButtons({ 
    assignmentId, 
    initialStatus 
}: { 
    assignmentId: string; 
    initialStatus: string;
}) {
    const [status, setStatus] = useState(initialStatus);
    const [loading, setLoading] = useState(false);

    async function handleStatus(newStatus: "CONFIRMED" | "DECLINED") {
        setLoading(true);
        const res = await updateAssignmentStatusPublicAction(assignmentId, newStatus);
        if (res.success) {
            setStatus(newStatus);
        } else {
            alert("Something went wrong. Please try again.");
        }
        setLoading(false);
    }

    if (status === "CONFIRMED") {
        return (
            <div className="text-center space-y-4 animate-in fade-in zoom-in duration-300">
                <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-10 h-10" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-green-800">Confirmed!</h3>
                    <p className="text-slate-600">See you there. We've notified the team leads.</p>
                </div>
                <Button variant="outline" className="w-full" onClick={() => setStatus("PENDING")}>
                    I need to change my status
                </Button>
            </div>
        );
    }

    if (status === "DECLINED") {
        return (
            <div className="text-center space-y-4 animate-in fade-in zoom-in duration-300">
                <div className="mx-auto w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                    <XCircle className="w-10 h-10" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-red-800">Declined</h3>
                    <p className="text-slate-600">Thanks for letting us know. Hope to see you next time.</p>
                </div>
                <Button variant="outline" className="w-full" onClick={() => setStatus("PENDING")}>
                    Actually, I can make it
                </Button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-4 pt-2">
            <Button 
                variant="outline" 
                size="lg" 
                className="h-14 rounded-2xl border-red-200 text-red-600 hover:bg-red-50"
                onClick={() => handleStatus("DECLINED")}
                disabled={loading}
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Decline"}
            </Button>
            <Button 
                size="lg" 
                className="h-14 rounded-2xl bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200"
                onClick={() => handleStatus("CONFIRMED")}
                disabled={loading}
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm"}
            </Button>
        </div>
    );
}
