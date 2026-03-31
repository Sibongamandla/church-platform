import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import MyProfileForm from "@/components/dashboard/MyProfileForm"; // We will create this
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function MyProfilePage() {
    const user = await getCurrentUser();
    if (!user) redirect("/login");

    let member = await prisma.member.findUnique({
        where: { userId: user.id },
        include: { smartProfile: true }
    });

    // Fallback: If no member found by userId, try to link by email
    if (!member && user.email) {
        const potentialMember = await prisma.member.findFirst({
            where: { email: user.email },
        });

        if (potentialMember) {
            member = await prisma.member.update({
                where: { id: potentialMember.id },
                data: { userId: user.id },
                include: { smartProfile: true },
            });
        }
    }

    // If still no member found, create one for the legitimate logged-in user!
    if (!member && user.email) {
        const [firstName, ...lastNameParts] = (user.name || "Unknown").split(" ");
        member = await prisma.member.create({
            data: {
                userId: user.id,
                email: user.email,
                firstName: firstName || "Unknown",
                lastName: lastNameParts.join(" ") || " ",
                status: "ACTIVE",
            },
            include: { smartProfile: true }
        });
    }

    if (!member) {
        // Fallback for extremely rare edge cases where member creation fails
        return (
            <div className="p-8 text-center">
                <h1 className="text-xl font-bold text-destructive">Profile System Error</h1>
                <p className="text-muted-foreground">
                    We could not load or generate your member profile. Please contact an admin.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">My Smart Profile</h1>
                <p className="text-muted-foreground">Update your evangelism page details.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Edit Profile</CardTitle>
                    <CardDescription>
                        This information is public on your unique landing page.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <MyProfileForm member={member} profile={member.smartProfile} />
                </CardContent>
            </Card>
        </div>
    );
}
