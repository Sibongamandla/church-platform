"use client";

import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useRef } from "react";

export default function DashboardQRCode({ url, slug }: { url: string, slug: string }) {
    const svgRef = useRef<SVGSVGElement>(null);

    const downloadQR = () => {
        if (!svgRef.current) return;

        const svgData = new XMLSerializer().serializeToString(svgRef.current);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const objUrl = URL.createObjectURL(svgBlob);

        img.onload = () => {
            canvas.width = 1000;
            canvas.height = 1000;
            if (ctx) {
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 50, 50, 900, 900);

                const pngUrl = canvas.toDataURL("image/png");
                const downloadLink = document.createElement("a");
                downloadLink.href = pngUrl;
                downloadLink.download = `${slug}-qr.png`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            }
            URL.revokeObjectURL(objUrl);
        };
        img.src = objUrl;
    };

    return (
        <div className="space-y-6 w-full flex flex-col items-center">
            <div className="p-4 bg-white rounded-lg border shadow-sm">
                <QRCodeSVG
                    value={url}
                    size={200}
                    level={"H"}
                    includeMargin={true}
                    ref={svgRef}
                />
            </div>
            <Button onClick={downloadQR} variant="secondary" className="w-full max-w-xs">
                <Download className="mr-2 h-4 w-4" />
                Download PNG
            </Button>
        </div>
    );
}
