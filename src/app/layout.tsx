// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Load fonts with Tailwind CSS support
const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "StatPearls - Drug Library",
  description: "Access accurate, structured medical topics from StatPearls with a clean UI and dark mode.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} scroll-smooth`}
    >
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>StatPearls - Drug Library</title>
      </head>
      <body className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white min-h-screen antialiased font-sans">
        {children}
      </body>
    </html>
  );
}