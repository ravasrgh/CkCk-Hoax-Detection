"use client";

import { SidebarProvider, useSidebar } from "@/lib/sidebarContext";
import HeaderBar from "@/components/layout/HeaderBar";
import SideNavBar from "@/components/layout/SideNavBar";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import CollaboratorBar from "@/components/layout/CollaboratorBar";
import { usePathname } from "next/navigation";

const SIDEBAR_W = 220;

function Shell({ children }: { children: React.ReactNode }) {
  const { open } = useSidebar();
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <>
      <HeaderBar />
      <SideNavBar />

      {/* Overlay untuk mobile saat sidebar terbuka */}
      <MobileOverlay />

      <main
        className="mt-[42px] min-h-screen pb-20 md:pb-[4vh] transition-[margin] duration-300 ease-in-out"
        style={{ marginLeft: open && !isHome ? SIDEBAR_W : 0 }}
      >
        {/* Landing page: full-width tanpa padding */}
        {isHome ? children : (
          <div className="px-4 py-6 md:px-8 md:py-8">{children}</div>
        )}
      </main>

      <CollaboratorBar />
      <MobileBottomNav />
    </>
  );
}

function MobileOverlay() {
  const { open, close } = useSidebar();
  if (!open) return null;
  return (
    <div
      className="md:hidden fixed inset-0 z-20 bg-black/50"
      onClick={close}
    />
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Shell>{children}</Shell>
    </SidebarProvider>
  );
}
