import { CheckCircle2 } from "lucide-react";

const beliefs = [
    {
        title: " The Bible",
        description: "We believe the Bible is the inspired and authoritative Word of God.",
    },
    {
        title: "The Trinity",
        description:
            "We believe in one God, eternally existing in three persons: Father, Son, and Holy Spirit.",
    },
    {
        title: "Salvation",
        description:
            "We believe salvation is a free gift of God found only through faith in Jesus Christ.",
    },
    {
        title: "The Church",
        description:
            "We believe the church is the body of Christ, called to be light in the world.",
    },
];

export function Beliefs() {
    return (
        <section className="py-20 bg-background">
            <div className="container px-4 md:px-6">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-foreground">
                            What We Believe
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            Our faith is anchored in Scripture and centered on Jesus. These core
                            beliefs guide our teaching and our lives.
                        </p>
                        <div className="space-y-4 pt-4">
                            {beliefs.map((belief) => (
                                <div key={belief.title} className="flex gap-4">
                                    <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-foreground text-lg">
                                            {belief.title}
                                        </h3>
                                        <p className="text-muted-foreground">{belief.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative aspect-square lg:aspect-video rounded-2xl bg-muted flex items-center justify-center text-muted-foreground border">
                        Image: Community Worship
                    </div>
                </div>
            </div>
        </section>
    );
}
