"use client";

import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

const links = [
    {
        title: "Platform Home",
        description: "The main landing page for the church platform.",
        path: "/",
        slug: "home"
    },
    {
        title: "Member Check-in",
        description: "Direct link for members to check themselves in.",
        path: "/check-in",
        slug: "check-in"
    },
    {
        title: "New Visitor Registration",
        description: "Direct link to the 'I'm New' form for visitors.",
        path: "/check-in?tab=visitor",
        slug: "visitor-reg"
    },
    {
        title: "Events Calendar",
        description: "Upcoming events and registration.",
        path: "/events",
        slug: "events"
    },
    {
        title: "Giving / Tithe",
        description: "Online giving page.",
        path: "/give",
        slug: "give"
    },
    {
        title: "Sermons Archive",
        description: "Watch past sermons and messages.",
        path: "/sermons",
        slug: "sermons"
    }
];

export default function QRCodesPage() {
    // We need to know the base URL to generate correct QRs.
    // In client component, we can use window.location.origin
    // But for SSR purposes / initial render, we might want a placeholder or effect.
    // Let's just use empty string and useEffect to key off window. location

    // Actually, simpler: just use relative paths (which qrcode might not like if scanned by generic reader)
    // No, QR codes MUST be absolute URLs.

    // We'll use a helper component for each card to handle the "download" logic cleanly
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Forever Links & QR Codes</h1>
                <p className="text-muted-foreground">
                    Static QR codes for key areas of the platform. Download and print these for signage.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {links.map((link) => (
                    <QRCodeCard key={link.slug} link={link} />
                ))}
            </div>
        </div>
    );
}

function QRCodeCard({ link }: { link: { title: string, description: string, path: string, slug: string } }) {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://your-church-url.com';
    const fullUrl = `${origin}${link.path}`;
    const svgRef = useRef<SVGSVGElement>(null);

    const downloadQR = () => {
        if (!svgRef.current) return;

        const svgData = new XMLSerializer().serializeToString(svgRef.current);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        // Add minimal styling to SVG for the image
        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
            canvas.width = 1000; // High res
            canvas.height = 1000;
            if (ctx) {
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 50, 50, 900, 900); // Draw with padding

                const pngUrl = canvas.toDataURL("image/png");
                const downloadLink = document.createElement("a");
                downloadLink.href = pngUrl;
                downloadLink.download = `${link.slug}-qr.png`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            }
            URL.revokeObjectURL(url);
        };
        img.src = url;
    };

    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle className="text-lg">{link.title}</CardTitle>
                <CardDescription className="text-xs h-10">{link.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center gap-6 pt-2">
                <div className="p-4 bg-white rounded-lg border shadow-sm">
                    <QRCodeSVG
                        value={fullUrl}
                        size={180}
                        level={"H"}
                        includeMargin={true}
                        ref={svgRef}
                    />
                </div>

                <div className="w-full space-y-2 mt-auto">
                    <div className="flex items-center justify-between text-xs text-muted-foreground bg-muted p-2 rounded truncate">
                        <span className="truncate flex-1 mr-2">{fullUrl}</span>
                        <Link href={link.path} target="_blank">
                            <ExternalLink className="h-3 w-3 hover:text-primary transition-colors" />
                        </Link>
                    </div>

                    <Button onClick={downloadQR} className="w-full" variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Download PNG
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
