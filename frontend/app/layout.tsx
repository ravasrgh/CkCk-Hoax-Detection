import type { Metadata } from "next";
import "./globals.css";
import SideNavBar from "@/components/layout/SideNavBar";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

export const metadata: Metadata = {
  title: "CkCk — Deteksi Hoaks Berbasis AI",
  description: "Privacy-Aware Hoax Detection — 100% Offline",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-ckck-bg text-ckck-text-primary antialiased">
        <SideNavBar />
        <main className="md:ml-[180px] min-h-screen pb-20 md:pb-0">
          <div className="px-4 py-6 md:px-8 md:py-8">{children}</div>
        </main>
        <MobileBottomNav />
      </body>
    </html>
  );
}
