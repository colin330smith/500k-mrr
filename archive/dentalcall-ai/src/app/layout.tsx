import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { PostHogProvider } from "@/components/providers/posthog-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DentalCall AI - Never Miss Another Patient Call",
  description:
    "AI receptionist that answers every call 24/7, books appointments, and integrates with your dental practice schedule. Stop losing $850+ per missed call.",
  keywords: [
    "dental AI receptionist",
    "dental practice phone answering",
    "AI appointment booking",
    "dental office automation",
    "missed calls dental",
  ],
  openGraph: {
    title: "DentalCall AI - Never Miss Another Patient Call",
    description:
      "AI receptionist for dental practices. Answer every call, book appointments 24/7.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <PostHogProvider>
          {children}
          <Toaster />
        </PostHogProvider>
      </body>
    </html>
  );
}
