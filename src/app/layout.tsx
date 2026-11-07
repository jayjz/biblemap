import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/Geist.ttf",
  weight: "100 900",
  display: "swap",
  variable: "--font-geist-sans",
});

const geistMono = localFont({
  src: "./fonts/GeistMono.ttf",
  weight: "100 900",
  display: "swap",
  variable: "--font-geist-mono",
});

const playfair = localFont({
  src: "./fonts/PlayfairDisplay.ttf",
  weight: "400 900",
  display: "swap",
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  title: "BibleMap",
  description: "Ancient stories, geography, art and questions that stay with us.",
  openGraph: {
    title: "BibleMap",
    description: "Ancient stories, geography, art and questions that stay with us.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BibleMap",
    description: "Ancient stories, geography, art and questions that stay with us.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
