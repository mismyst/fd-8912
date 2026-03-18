import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { EmailAuth } from "@/components/auth/email-auth";
import { AppShell } from "@/components/layout/app-shell";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Founderz",
  description: "AI startup co-founder workspace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <TooltipProvider>
          <AppShell authNode={<EmailAuth />}>{children}</AppShell>
          <Toaster richColors />
        </TooltipProvider>
      </body>
    </html>
  );
}
