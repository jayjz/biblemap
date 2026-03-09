import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "BibleExplorer",
  description: "Explore the Stories of the Bible in a way you never have.",
  openGraph: {
    title: "BibleExplorer",
    description: "Explore the Stories of the Bible in a way you never have.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BibleExplorer",
    description: "Explore the Stories of the Bible in a way you never have.",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
