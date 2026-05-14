"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/lib/sidebarContext";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/analyzer", label: "Analyzer", icon: "🔍" },
  { href: "/riwayat", label: "Riwayat", icon: "📋" },
  { href: "/tentang", label: "Tentang", icon: "ℹ️" },
  { href: "/playground", label: "Playground", icon: "🧪" },
  { href: "/status", label: "Status Sistem", icon: "⚙️" },
];

export default function SideNavBar() {
  const pathname = usePathname();
  const { open, toggle } = useSidebar();

  return (
    <aside
      className="hidden md:flex flex-col fixed left-0 top-[42px] bottom-0 z-30 transition-transform duration-300 ease-in-out"
      style={{
        width: 220,
        backgroundColor: "var(--bg-sidebar)",
        borderRight: "1px solid var(--border-sidebar)",
        transform: open ? "translateX(0)" : "translateX(-100%)",
      }}
    >
      <nav className="flex-1 py-2 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 px-4 py-3 text-sm transition-colors font-sans"
              style={{
                backgroundColor: active ? "var(--bg-sidebar-active)" : "transparent",
                borderLeft: active ? "3px solid var(--accent-primary)" : "3px solid transparent",
                color: active ? "var(--text-primary)" : "var(--text-secondary)",
              }}
            >
              <span className="text-sm">{item.icon}</span>
              <span className="text-xs uppercase tracking-wide font-medium">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div style={{ borderTop: "1px solid var(--border-sidebar)" }}>
        <div className="px-4 py-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full animate-pulse shrink-0" style={{ backgroundColor: "var(--accent-primary)" }} />
          <span className="text-[10px] uppercase tracking-widest font-sans font-semibold" style={{ color: "var(--accent-primary)" }}>
            OFFLINE
          </span>
        </div>

        <button
          onClick={toggle}
          className="w-full flex items-center gap-2 px-4 py-3 text-xs font-sans font-medium uppercase tracking-wide transition-colors"
          style={{ color: "var(--text-muted)", borderTop: "1px solid var(--border-sidebar)" }}
          title="Tutup sidebar"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Tutup Sidebar
        </button>
      </div>
    </aside>
  );
}
