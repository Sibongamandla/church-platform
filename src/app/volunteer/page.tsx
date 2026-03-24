import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users, HeartHandshake, CheckCircle } from "lucide-react";
import { joinTeamAction } from "@/app/actions/volunteers";

export default async function VolunteerPage() {
    const user = await getCurrentUser();
    let member = null;
    let userTeamIds: string[] = [];

    if (user) {
        member = await prisma.member.findUnique({
            where: { userId: user.id },
            include: { teamMemberships: true }
        });
        if (member) {
            userTeamIds = member.teamMemberships.map((tm) => tm.teamId);
        }
    }

    const teams = await prisma.team.findMany({
        orderBy: { name: "asc" }
    });

    return (
        <div className="min-h-screen bg-background pt-24 pb-16">
            <div className="container mx-auto px-4 md:px-6 max-w-5xl">
                <div className="text-center space-y-4 mb-16">
                    <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                        <HeartHandshake className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black font-heading tracking-tight uppercase">
                        Join the <span className="text-primary">Team</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        We believe that everyone has a part to play in the body of Christ. Use your gifts and talents to serve others and make an impact.
                    </p>
                </div>

                {!user && (
                    <div className="bg-secondary/10 border border-secondary/20 rounded-2xl p-8 mb-12 text-center max-w-2xl mx-auto">
                        <h2 className="text-2xl font-bold mb-4">Ready to serve?</h2>
                        <p className="text-muted-foreground mb-6">
                            Please log in or create an account to view available teams and volunteer.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link href="/login">
                                <Button size="lg">Log In</Button>
                            </Link>
                            <Link href="/register">
                                <Button size="lg" variant="outline">Sign Up</Button>
                            </Link>
                        </div>
                    </div>
                )}

                {user && !member && (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-8 mb-12 text-center max-w-2xl mx-auto">
                        <h2 className="text-2xl font-bold mb-4">Complete your profile</h2>
                        <p className="text-muted-foreground mb-6">
                            Before you can volunteer, please complete your member profile so we can link your service assignments.
                        </p>
                        <Link href="/dashboard/profile">
                            <Button size="lg">Complete Profile</Button>
                        </Link>
                    </div>
                )}

                {user && member && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {teams.length === 0 ? (
                            <div className="col-span-full border-2 border-dashed rounded-xl p-12 text-center text-muted-foreground">
                                <Users className="mx-auto h-12 w-12 opacity-50 mb-4" />
                                <h3 className="text-lg font-medium text-foreground mb-2">No Teams Available</h3>
                                <p>Check back later for opportunities to serve.</p>
                            </div>
                        ) : teams.map(team => {
                            const isMember = userTeamIds.includes(team.id);

                            return (
                                <div key={team.id} className="rounded-2xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col hover:shadow-lg transition-all duration-300">
                                    <div className="mb-4">
                                        <h3 className="font-bold text-xl mb-2">{team.name}</h3>
                                        <p className="text-sm text-muted-foreground line-clamp-3">
                                            {team.description || "Join this amazing team to serve the church community."}
                                        </p>
                                    </div>
                                    
                                    <div className="mt-auto pt-6">
                                        {isMember ? (
                                            <div className="w-full flex justify-center items-center py-2 px-4 bg-green-500/10 text-green-600 rounded-md font-medium">
                                                <CheckCircle className="w-5 h-5 mr-2" />
                                                Already Joined
                                            </div>
                                        ) : (
                                            <form action={async () => {
                                                "use server";
                                                await joinTeamAction(team.id);
                                            }}>
                                                <Button type="submit" className="w-full relative overflow-hidden group">
                                                    <span className="relative z-10 font-semibold group-hover:text-primary-foreground transition-colors duration-300">
                                                        Volunteer for {team.name}
                                                    </span>
                                                    <div className="absolute inset-0 h-full w-full bg-primary transform scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100 mix-blend-multiply"></div>
                                                </Button>
                                            </form>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
