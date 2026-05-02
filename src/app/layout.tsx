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
  // Application temporarily suspended
  return (
    <html lang="en" className="scroll-smooth">
      <body className={cn(
        manrope.className,
        oswald.variable,
        manrope.variable,
        "antialiased min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4"
      )}>
        <div className="max-w-2xl w-full text-center flex flex-col items-center justify-center space-y-12">
            <div className="flex flex-col items-center">
                <span className="font-heading text-4xl md:text-5xl font-bold tracking-tight uppercase text-primary">
                    Great Nation<br/><span className="text-muted-foreground text-3xl md:text-4xl">Ministries</span>
                </span>
            </div>
            
            <div className="bg-secondary/30 p-8 md:p-12 rounded-3xl border border-border/50 shadow-xl w-full">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                </div>
                <h1 className="text-3xl font-heading font-bold mb-6 text-foreground">Notice: Service Paused</h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                    The Great Nation Ministries church members platform is currently on an <strong className="text-foreground">Administrative Hold</strong>. 
                </p>
                <div className="h-px w-12 bg-border mx-auto my-6"></div>
                <p className="text-md text-muted-foreground leading-relaxed mb-6">
                    Access to service registrations, member profiles, and digital features has been temporarily suspended. 
                    For updates on when the platform will be back online, please contact the Church Administration office directly.
                </p>
                <a href="mailto:admin@greatnationministries.com" className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
                    Contact Administration
                </a>
            </div>
        </div>
      </body>
    </html>
  );
}
