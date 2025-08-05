import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";
import Header from "@/components/Layout/Header";
import GamificationTracker from "@/components/Layout/GamificationTracker";
import Starfield from "@/components/Starfield";
import PageTransition from "@/components/Layout/PageTransition";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Bring Home the Martian",
    template: "%s | Bring Home the Martian",
  },
  description: "Explore NASA's Mars Rover Pictures.",
  metadataBase: new URL("https://yourdomain.com"),
  openGraph: {
    title: "Bring Home the Martian",
    description: "Discover Mars with NASA rover pictures.",
    type: "website",
    url: "https://yourdomain.com",
    siteName: "Bring Home the Martian",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Bring Home the Martian",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bring Home the Martian",
    description: "Discover Mars with NASA rover pictures.",
    creator: "@your_twitter",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <PageTransition>
          <Providers>
            <Header />
            <GamificationTracker />
            {children}
          </Providers>
        </PageTransition>
      </body>
    </html>
  );
}
