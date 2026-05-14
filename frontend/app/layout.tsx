import type { Metadata } from "next";
import { Sora, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SideNavBar from "@/components/layout/SideNavBar";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import CollaboratorBar from "@/components/layout/CollaboratorBar";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "700"],
});

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
    <html lang="id" className={`${sora.variable} ${mono.variable}`}>
      <body className="bg-[#18130B] text-[#EDE1D4] antialiased font-sora">
        <SideNavBar />
        <main className="md:ml-[220px] min-h-screen pb-20 md:pb-0">
          <div className="px-4 py-6 md:px-8 md:py-8">{children}</div>
          <CollaboratorBar />
        </main>
        <MobileBottomNav />
      </body>
    </html>
  );
}
