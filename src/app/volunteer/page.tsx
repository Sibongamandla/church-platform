import { prisma } from "@/lib/prisma";
import { HeartHandshake } from "lucide-react";
import { VolunteerSignUpForm } from "@/components/volunteers/VolunteerSignUpForm";

export default async function VolunteerPage() {
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

                <VolunteerSignUpForm teams={teams} />
            </div>
        </div>
    );
}
