"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CalendarPlus, ChevronDown, Chrome, Apple } from "lucide-react";
import { generateGoogleCalendarLink, generateICalData, CalendarEvent } from "@/lib/calendar";
import { cn } from "@/lib/utils";

export function AddToCalendar({ event }: { event: CalendarEvent }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleGoogleCalendar = () => {
        window.open(generateGoogleCalendarLink(event), "_blank");
        setIsOpen(false);
    };

    const handleICal = () => {
        const data = generateICalData(event);
        const blob = new Blob([data], { type: "text/calendar;charset=utf-8" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${event.title.replace(/\s+/g, "_")}.ics`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setIsOpen(false);
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <Button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full h-16 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 gap-2"
            >
                <CalendarPlus className="h-5 w-5" />
                Add to Calendar
                <ChevronDown className={cn("h-4 w-4 opacity-50 ml-auto transition-transform", isOpen && "rotate-180")} />
            </Button>

            {isOpen && (
                <div className="absolute top-full left-0 w-full mt-2 bg-card border border-muted rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
                    <button 
                        onClick={handleGoogleCalendar}
                        className="flex items-center gap-3 w-full p-4 rounded-xl hover:bg-muted transition-colors text-left group"
                    >
                        <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                            <Chrome className="h-5 w-5 text-amber-500" />
                        </div>
                        <div>
                            <p className="font-bold text-sm">Google Calendar</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Online</p>
                        </div>
                    </button>
                    
                    <button 
                        onClick={handleICal}
                        className="flex items-center gap-3 w-full p-4 rounded-xl hover:bg-muted transition-colors text-left group"
                    >
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <Apple className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="font-bold text-sm">Apple / Outlook</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Download .ics</p>
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
}
