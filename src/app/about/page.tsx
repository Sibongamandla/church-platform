import { History } from "@/components/about/History";
import { LeadershipTeam } from "@/components/about/LeadershipTeam";
import { Beliefs } from "@/components/about/Beliefs";

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <div className="bg-muted/50 py-20 text-center">
                <div className="container px-4 md:px-6">
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl mb-4">
                        About Us
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Knowing God, loving people, and serving our world.
                    </p>
                </div>
            </div>
            <History />
            <LeadershipTeam />
            <Beliefs />
        </div>
    );
}
