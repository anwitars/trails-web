import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tiny Trails",
  description: "Just another URL shortener.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${openSans.variable} antialiased`}>
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}
