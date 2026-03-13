import Image from "next/image";

const leaders = [
    {
        name: "Rev. David Smith",
        role: "Senior Pastor",
        bio: "Passionate about teaching the Word and building community.",
        imageUrl: "/leaders/pastor-david.jpg", // Placeholder
    },
    {
        name: "Sarah Johnson",
        role: "Worship Director",
        bio: "Leading our congregation in heartfelt worship every week.",
        imageUrl: "/leaders/sarah.jpg", // Placeholder
    },
    {
        name: "Michael Chen",
        role: "Youth Pastor",
        bio: "Dedicated to equipping the next generation of believers.",
        imageUrl: "/leaders/michael.jpg", // Placeholder
    },
];

export function LeadershipTeam() {
    return (
        <section className="py-20 bg-muted/30">
            <div className="container px-4 md:px-6">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-foreground">
                        Our Leadership
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Meet the dedicated team serving our church family.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {leaders.map((leader) => (
                        <div
                            key={leader.name}
                            className="group bg-card rounded-xl overflow-hidden shadow-sm border hover:shadow-md transition-all"
                        >
                            <div className="aspect-square relative bg-muted flex items-center justify-center text-muted-foreground">
                                {/* Replace with actual Image component when assets exist */}
                                <span className="text-sm">Photo of {leader.name}</span>
                            </div>
                            <div className="p-6 text-center space-y-2">
                                <h3 className="text-xl font-bold text-foreground">{leader.name}</h3>
                                <p className="text-primary font-medium text-sm uppercase tracking-wide">
                                    {leader.role}
                                </p>
                                <p className="text-muted-foreground text-sm pt-2">{leader.bio}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
