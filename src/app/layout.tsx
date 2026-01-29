import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";
import { ToastProvider } from "@/components/ui/Toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Farewell Vintage Camera",
  description:
    "Capture beautiful moments with a vintage camera experience in your browser. Film grain, light leaks, and nostalgic vibes.",
  keywords: [
    "camera",
    "vintage",
    "film",
    "photography",
    "camera",
    "retro",
  ],
  authors: [{ name: "Farewell Camera" }],
  openGraph: {
    title: "Farewell Vintage Camera",
    description: "A vintage camera experience in your browser",
    type: "website",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Farewell Camera",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1a1a1a",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="antialiased min-h-screen min-h-dvh bg-vintage-black text-vintage-cream">
        <ToastProvider>
          <main className="relative min-h-screen min-h-dvh">{children}</main>
          <Navigation />
        </ToastProvider>
      </body>
    </html>
  );
}
