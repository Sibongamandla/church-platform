import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react"; // We'll client-wrap this or simply use it if server-side compatible (it is mostly SVG string gen)
// Actually QRCodeSVG is a component, so we might need a "use client" wrapper if passing complex props, but simple usage in SC is flaky in some versions.
// Let's use a Client Component for the QR code display to be safe and interactive.
import DashboardQRCode from "@/components/dashboard/DashboardQRCode";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, QrCode, User } from "lucide-react";

export default async function DashboardPage() {
    const user = await getCurrentUser();
    if (!user) return null; // handled by layout

    // Find linked member profile by User ID
    let member = await prisma.member.findUnique({
        where: { userId: user.id },
        include: {
            smartProfile: true,
            recruits: {
                orderBy: { createdAt: 'desc' },
                take: 5 // Show last 5
            },
            _count: {
                select: { recruits: true }
            }
        }
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
                include: {
                    smartProfile: true,
                    recruits: {
                        orderBy: { createdAt: 'desc' },
                        take: 5
                    },
                    _count: {
                        select: { recruits: true }
                    }
                }
            });
        }
    }

    const smartProfile = member?.smartProfile;
    const recruitsCount = member?._count.recruits || 0;
    const recentRecruits = member?.recruits || [];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user.name}</h1>
                <p className="text-muted-foreground">Manage your church profile and evangelism tools.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Profile Status */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5 text-primary" />
                            My Smart Profile
                        </CardTitle>
                        <CardDescription>Your digital business card for outreach.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {smartProfile ? (
                            <div className="space-y-4">
                                <div className="p-3 bg-green-50 text-green-700 rounded-md border border-green-100 text-sm">
                                    <span className="font-semibold">Active:</span> /e/{smartProfile.slug}
                                </div>
                                <div className="flex gap-2">
                                    <Link href={`/e/${smartProfile.slug}`} target="_blank" className="w-full">
                                        <Button variant="outline" className="w-full">View Public Page</Button>
                                    </Link>
                                    <Link href="/dashboard/profile" className="w-full">
                                        <Button className="w-full">Edit Profile</Button>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    You haven't set up your Smart Profile yet. Create one to share your info and get a personal QR code.
                                </p>
                                <Link href="/dashboard/profile">
                                    <Button className="w-full gap-2">
                                        <ArrowRight className="h-4 w-4" />
                                        Create My Profile
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* QR Code */}
                {smartProfile && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <QrCode className="h-5 w-5 text-primary" />
                                My QR Code
                            </CardTitle>
                            <CardDescription>Share this code to lead people to your profile.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center pt-2">
                            <DashboardQRCode url={`${process.env.NEXTAUTH_URL || 'https://church.com'}/e/${smartProfile.slug}`} slug={smartProfile.slug} />
                        </CardContent>
                    </Card>
                )}

                {/* Recruitment Stats */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5 text-primary" />
                            People I've Invited
                        </CardTitle>
                        <CardDescription>
                            You have invited <span className="font-bold text-foreground">{recruitsCount}</span> people who joined!
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {recentRecruits.length > 0 ? (
                            <div className="rounded-md border">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-muted/50">
                                        <tr>
                                            <th className="p-3 font-medium">Name</th>
                                            <th className="p-3 font-medium">Joined Date</th>
                                            <th className="p-3 font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentRecruits.map((recruit) => (
                                            <tr key={recruit.id} className="border-t">
                                                <td className="p-3 font-medium">{recruit.firstName} {recruit.lastName}</td>
                                                <td className="p-3 text-muted-foreground">{new Date(recruit.createdAt).toLocaleDateString()}</td>
                                                <td className="p-3">
                                                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80">
                                                        New
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <p>No recruits yet. Share your QR code to invite friends!</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
