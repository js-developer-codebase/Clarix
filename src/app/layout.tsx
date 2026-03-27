import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/app/providers";

export const metadata: Metadata = {
  title: "Clarix - Production Subscription Management",
  description: "Enterprise SaaS Subscription Manager for modern Indian companies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased bg-[#0a0a0a] text-white`}
      >
        <Providers>
          {children}
          <Toaster position="top-right" theme="dark" closeButton />
        </Providers>
      </body>
    </html>
  );
}
