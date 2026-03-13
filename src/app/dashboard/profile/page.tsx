import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import MyProfileForm from "@/components/dashboard/MyProfileForm"; // We will create this
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function MyProfilePage() {
    const user = await getCurrentUser();
    if (!user) redirect("/login");

    const member = await prisma.member.findUnique({
        where: { userId: user.id },
        include: { smartProfile: true }
    });

    if (!member) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-xl font-bold text-destructive">Member Record Not Found</h1>
                <p className="text-muted-foreground">
                    We assume your account email matches your member record. Please contact an admin if you see this.
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
