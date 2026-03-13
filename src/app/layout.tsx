import type { Metadata } from "next";
import { Oswald, Manrope } from "next/font/google"; // Changed fonts
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

// Load fonts
const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
});
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: {
    default: "Great Nation Ministries | Welcome Home",
    template: "%s | Great Nation"
  },
  description: "A specialized platform for church management, digital evangelism, and community engagement.",
  keywords: ["church", "management", "evangelism", "platform", "qr code", "attendance"],
  authors: [{ name: "Church Team" }],
  creator: "Church Platform",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://grace-platform.com",
    title: "GracePlatform",
    description: "Modern tools for growing churches.",
    siteName: "GracePlatform",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F2EA" }, // Soft Cream
    { media: "(prefers-color-scheme: dark)", color: "#1A1A1A" }, // Charcoal
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={cn(
        manrope.className,
        oswald.variable,
        manrope.variable,
        "antialiased min-h-screen flex flex-col bg-background text-foreground"
      )}>
        <Navbar />
        <main className="flex-1 pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
