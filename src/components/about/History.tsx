import { HandHeart } from "lucide-react";

export function History() {
    return (
        <section className="py-20 bg-background">
            <div className="container px-4 md:px-6">
                <div className="mx-auto max-w-3xl space-y-8">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-foreground">
                            Our Story
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            From humble beginnings to a thriving community.
                        </p>
                    </div>
                    <div className="prose prose-lg dark:prose-invert mx-auto text-muted-foreground">
                        <p>
                            GracePlatform began in 2010 with just five families meeting in a living
                            room, united by a simple vision: to create a church where everyone is
                            welcome and Jesus is the center.
                        </p>
                        <p>
                            Over the years, we&apos;ve seen incredible growth, not just in numbers,
                            but in the depth of community and the impact on our city. We moved
                            from that living room to a school hall, and eventually to our current
                            home in 2018.
                        </p>
                        <p>
                            Today, we are a multi-generational, diverse family of believers
                            passionate about serving our community and sharing the love of Christ.
                            Our history is still being written, and we invite you to be a part of
                            it.
                        </p>
                    </div>
                    <div className="flex justify-center pt-8">
                        <div className="flex flex-col items-center gap-2 text-primary">
                            <HandHeart className="h-12 w-12" />
                            <span className="font-semibold">Established 2010</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
