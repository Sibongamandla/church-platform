import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KioskWrapper } from "@/components/check-in/KioskWrapper";

export default async function CheckInPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { ref, success } = await searchParams;

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

    return (
        <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-4 md:p-8">
            <KioskWrapper recruiterSlug={typeof ref === 'string' ? ref : undefined} />

            <p className="mt-8 text-center text-xs text-muted-foreground animate-fade-in">
                <Link href="/" className="hover:text-primary transition-colors">
                    Back to Home
                </Link>
            </p>
        </div>
    );
}
