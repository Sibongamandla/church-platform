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

import { Analytics } from "@vercel/analytics/next";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { getCurrentUser } from "@/lib/auth";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Toggle this variable to lock/unlock the platform
  const IS_MAINTENANCE = true;

  if (IS_MAINTENANCE) {
    return (
      <html lang="en" className="scroll-smooth">
        <body className={cn(
          manrope.className,
          oswald.variable,
          manrope.variable,
          "antialiased min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4 overflow-hidden relative"
        )}>
          {/* Ambient background glow accents */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[120px] pointer-events-none -z-10" />
          <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />

          <div className="max-w-xl w-full text-center flex flex-col items-center justify-center space-y-8 animate-fade-in-up relative z-10">
            <div className="flex flex-col items-center space-y-2">
              <span className="font-heading text-4xl md:text-5xl font-bold tracking-tight uppercase text-primary">
                Great Nation
              </span>
              <span className="text-gold tracking-[0.2em] uppercase text-sm font-semibold">
                Ministries
              </span>
            </div>
            
            <div className="bg-card/50 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-border/40 shadow-2xl w-full transition-all duration-300 hover:shadow-gold/5 hover:border-gold/20">
              <div className="w-16 h-16 bg-gold/10 text-gold rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-gold/5">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-heading font-bold mb-4 text-foreground tracking-wide">
                Platform Offline
              </h1>
              
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                The member portal is currently unavailable for scheduled maintenance and updates.
              </p>
              
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-border to-transparent mx-auto my-6"></div>
              
              <p className="text-xs md:text-sm text-muted-foreground/80 leading-relaxed mb-8">
                Access to registrations, member profiles, and service administration has been temporarily suspended. We will be back online shortly.
              </p>
              
              <a 
                href="mailto:admin@greatnationministries.com" 
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-gold hover:text-primary-foreground transition-all duration-300 shadow-lg hover:shadow-gold/20 hover:-translate-y-0.5 active:translate-y-0"
              >
                Contact Administration
              </a>
            </div>
            
            <p className="text-xs text-muted-foreground/50 tracking-wider font-medium">
              © {new Date().getFullYear()} GREAT NATION MINISTRIES. ALL RIGHTS RESERVED.
            </p>
          </div>
        </body>
      </html>
    );
  }

  const user = await getCurrentUser();

  return (
    <html lang="en" className="scroll-smooth">
      <body className={cn(
        manrope.className,
        oswald.variable,
        manrope.variable,
        "antialiased min-h-screen flex flex-col bg-background text-foreground"
      )}>
        <Analytics />
        <ScrollToTop />
        <ConditionalShell user={user} />
        <main className="flex-1">{children}</main>
        <ConditionalFooter />
      </body>
    </html>
  );
}
