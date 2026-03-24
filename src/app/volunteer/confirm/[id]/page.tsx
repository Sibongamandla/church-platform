import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { CheckCircle, XCircle, Calendar, Clock, MapPin, User, ShieldCheck } from "lucide-react";
import { ConfirmationButtons } from "./ConfirmationButtons";

export default async function ConfirmPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const assignment = await prisma.rosterAssignment.findUnique({
        where: { id: params.id },
        include: {
            member: true,
            role: { include: { team: true } },
            schedule: { include: { session: true } }
        }
    });

    if (!assignment) notFound();

    const session = assignment.schedule.session;
    const isPast = new Date(session.date) < new Date(new Date().setHours(0,0,0,0));

    // Construct times
    const [hours, minutes] = (assignment.callTime || "08:00").split(':').map(Number);
    const eventStartTime = new Date(session.date);
    eventStartTime.setHours(hours || 8, minutes || 0, 0, 0);

    const eventEndTime = new Date(eventStartTime);
    eventEndTime.setHours(eventStartTime.getHours() + 2);

    const eventDetails = {
        title: `Service Roster: ${assignment.role.name} @ ${session.name}`,
        description: `Team: ${assignment.role.team.name}\nRole: ${assignment.role.name}\nPlease arrive by ${assignment.callTime || 'service start'}.\n\nConfirmed via Church Volunteer Platform.`,
        startTime: eventStartTime,
        endTime: eventEndTime,
        location: "Great Nation Ministries"
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
                {/* Header */}
                <div className="bg-primary p-8 text-white text-center">
                    <div className="mx-auto w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold">Service Roster</h1>
                    <p className="text-primary-foreground/80 mt-1">Assignment Confirmation</p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    <div className="text-center">
                        <h2 className="text-xl font-semibold">Hi, {assignment.member.firstName}!</h2>
                        <p className="text-slate-500 text-sm mt-1">You've been scheduled for the following service:</p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-4 space-y-4 border border-slate-100">
                        <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 text-primary mt-0.5" />
                            <div>
                                <p className="font-semibold text-slate-900">{session.name}</p>
                                <p className="text-sm text-slate-500">{new Date(session.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 text-primary mt-0.5" />
                            <div>
                                <p className="font-semibold text-slate-900">Call Time: {assignment.callTime || "TBD"}</p>
                                <p className="text-sm text-slate-500">Service Date: {new Date(session.date).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 border-t border-slate-200 pt-4">
                            <User className="w-5 h-5 text-primary mt-0.5" />
                            <div>
                                <p className="font-semibold text-slate-900">{assignment.role.name}</p>
                                <p className="text-sm text-slate-500">{assignment.role.team.name}</p>
                            </div>
                        </div>
                    </div>

                    {isPast ? (
                        <div className="text-center p-4 bg-slate-100 rounded-xl text-slate-500 text-sm">
                            This service has already passed.
                        </div>
                    ) : (
                        <ConfirmationButtons 
                            assignmentId={assignment.id} 
                            initialStatus={assignment.status} 
                            eventDetails={eventDetails}
                        />
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-slate-50 text-center border-t border-slate-100">
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Great Nation Ministries • Church Platform</p>
                </div>
            </div>
        </div>
    );
}
