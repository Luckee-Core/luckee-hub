import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppShell } from "@/components/app-shell";
import { LocalDatabaseCleanupListener } from "@/components/local-database-cleanup-listener";
import { SystemMetricsPollingListener } from "@/components/system-metrics-polling-listener";
import { ReduxProvider } from "@/components/ReduxProvider";
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
  title: "Luckee Dev Hub",
  description: "Central launcher for Luckee open-source projects",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}
      >
        <ReduxProvider>
          <LocalDatabaseCleanupListener />
          <SystemMetricsPollingListener />
          <AppShell>{children}</AppShell>
        </ReduxProvider>
      </body>
    </html>
  );
}
