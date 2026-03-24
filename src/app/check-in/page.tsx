import Link from "next/link";
import { Check, Clock, CalendarX, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KioskWrapper } from "@/components/check-in/KioskWrapper";
import { getActiveSession } from "@/lib/sessions";

export default async function CheckInPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { ref, success } = await searchParams;
    const activeSession = await getActiveSession();

    if (success === "true") {
        return (
            <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md bg-card rounded-[2rem] p-12 text-center shadow-xl border border-border/50 animate-fade-in-up">
                    <div className="mx-auto mb-6 h-24 w-24 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="h-12 w-12 text-green-600 animate-pulse" />
                    </div>
                    <h1 className="text-3xl font-heading font-black text-primary mb-2">You're Checked In!</h1>
                    <p className="text-muted-foreground text-lg mb-8">
                        Welcome to Great Nation Ministries. We are so glad you are here.
                    </p>
                    <Link href="/check-in">
                        <Button className="w-full rounded-full h-12 text-lg font-bold">
                            Check In Another Person
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (!activeSession) {
        return (
            <div className="min-h-screen bg-muted/10 flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-[2.5rem] p-10 text-center shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-500">
                    <div className="mx-auto mb-8 w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
                        <CalendarX className="h-12 w-12 text-slate-300" />
                    </div>
                    
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase mb-4">
                        Check-in <span className="text-slate-400">Closed</span>
                    </h1>
                    
                    <div className="space-y-4 mb-10">
                        <p className="text-slate-500 leading-relaxed">
                            Self-service check-in is currently unavailable as there are no active sessions scheduled for this time.
                        </p>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full text-xs font-bold text-slate-500 uppercase tracking-widest">
                            <Clock className="h-3 w-3" />
                          Usually opens 30m before service
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Link href="/">
                            <Button variant="outline" className="w-full rounded-2xl h-14 font-bold border-slate-200 hover:bg-slate-50">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-4 md:p-8">
            <div className="mb-8 text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full text-xs font-black text-primary uppercase tracking-tighter">
                   <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                   Active Session: {activeSession.name}
                </div>
            </div>
            
            <KioskWrapper recruiterSlug={typeof ref === 'string' ? ref : undefined} />

            <p className="mt-8 text-center text-xs text-muted-foreground animate-fade-in">
                <Link href="/" className="hover:text-primary transition-colors">
                    Back to Home
                </Link>
            </p>
        </div>
    );
}
