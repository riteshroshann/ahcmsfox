import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AHCMS — Amrita Hostel & Complaint Management",
  description: "Hostel allocation, complaint tracking, and resource management for Amrita University, Delhi NCR",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
