import type { Metadata } from "next";
import { Oswald, Manrope } from "next/font/google";
import "./globals.css";
import { ConditionalShell, ConditionalFooter } from "@/components/layout/ConditionalShell";
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
  creator: "Great Nation Ministries Team",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://greatnationministries.com",
    title: "Great Nation Ministries | Welcome Home",
    description: "A vibrant community dedicated to loving Jesus and loving people.",
    siteName: "Great Nation Ministries",
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

import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { getCurrentUser } from "@/lib/auth";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="en" className="scroll-smooth">
      <body className={cn(
        manrope.className,
        oswald.variable,
        manrope.variable,
        "antialiased min-h-screen flex flex-col bg-background text-foreground"
      )}>
        <ScrollToTop />
        <ConditionalShell user={user} />
        <main className="flex-1">{children}</main>
        <ConditionalFooter />
      </body>
    </html>
  );
}
