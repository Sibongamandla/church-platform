"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { updateAssignmentStatusPublicAction } from "@/app/actions/volunteers";
import { CheckCircle, XCircle, Loader2, CalendarPlus, Timer } from "lucide-react";

export function ConfirmationButtons({ 
    assignmentId, 
    initialStatus,
    eventDetails
}: { 
    assignmentId: string; 
    initialStatus: string;
    eventDetails: {
        title: string;
        description: string;
        startTime: Date;
        endTime: Date;
        location?: string;
    }
}) {
    const [status, setStatus] = useState(initialStatus);
    const [loading, setLoading] = useState(false);
    const [showCalendarOptions, setShowCalendarOptions] = useState(false);

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

    const getGoogleCalendarUrl = () => {
        const { title, description, startTime, endTime, location } = eventDetails;
        const fmt = (d: Date) => new Date(d).toISOString().replace(/-|:|\.\d+/g, '');
        const url = new URL("https://www.google.com/calendar/render");
        url.searchParams.append("action", "TEMPLATE");
        url.searchParams.append("text", title);
        url.searchParams.append("dates", `${fmt(startTime)}/${fmt(endTime)}`);
        url.searchParams.append("details", description);
        if (location) url.searchParams.append("location", location);
        return url.toString();
    };

    const downloadIcsFile = () => {
        const { title, description, startTime, endTime, location } = eventDetails;
        const fmt = (d: Date) => new Date(d).toISOString().replace(/-|:|\.\d+/g, '');
        const icsContent = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "BEGIN:VEVENT",
            `DTSTART:${fmt(startTime)}`,
            `DTEND:${fmt(endTime)}`,
            `SUMMARY:${title}`,
            `DESCRIPTION:${description.replace(/\n/g, "\\n")}`,
            location ? `LOCATION:${location}` : "",
            "END:VEVENT",
            "END:VCALENDAR"
        ].filter(Boolean).join("\n");

        const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute("download", "roster-event.ics");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

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

                <div className="pt-4 space-y-3">
                    {!showCalendarOptions ? (
                        <Button 
                            className="w-full h-12 rounded-2xl bg-slate-900 hover:bg-slate-800 flex items-center justify-center gap-2"
                            onClick={() => setShowCalendarOptions(true)}
                        >
                            <CalendarPlus className="w-5 h-5" />
                            Add to Calendar
                        </Button>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 animate-in slide-in-from-bottom-2 duration-300">
                            <a 
                                href={getGoogleCalendarUrl()} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="h-12 flex items-center justify-center gap-2 bg-white border border-slate-200 rounded-2xl text-sm font-medium hover:bg-slate-50 transition-colors"
                            >
                                <img src="https://www.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_31_2x.png" className="w-4 h-4" alt="Google" />
                                Google
                            </a>
                            <button 
                                onClick={downloadIcsFile}
                                className="h-12 flex items-center justify-center gap-2 bg-white border border-slate-200 rounded-2xl text-sm font-medium hover:bg-slate-50 transition-colors"
                            >
                                <CalendarPlus className="w-4 h-4 text-slate-600" />
                                iCal / Outlook
                            </button>
                        </div>
                    )}

                    <Button variant="ghost" className="text-slate-400 text-xs" onClick={() => setStatus("PENDING")}>
                        I need to change my status
                    </Button>
                </div>
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
                <Button variant="outline" className="w-full rounded-2xl h-12" onClick={() => setStatus("PENDING")}>
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
