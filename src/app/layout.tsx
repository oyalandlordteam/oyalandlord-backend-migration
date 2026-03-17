import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { StoreProvider } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Oyalandlord - Nigeria's Agent-Free Rental Marketplace",
  description: "Connect directly with landlords, find your perfect home, and rent with confidence. Nigeria's premier platform for agent-free property rentals.",
  keywords: ["Nigeria", "rental", "property", "landlord", "tenant", "real estate", "no agent", "Lagos", "Abuja"],
  authors: [{ name: "Oyalandlord Team" }],
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "Oyalandlord - Nigeria's Agent-Free Rental Marketplace",
    description: "Connect directly with landlords and find your perfect home",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <StoreProvider>
          <div className="min-h-screen">
            <main>
              {children}
            </main>
          </div>
        </StoreProvider>
        <Toaster />
      </body>
    </html>
  );
}
