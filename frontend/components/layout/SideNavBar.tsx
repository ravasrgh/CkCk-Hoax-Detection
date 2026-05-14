"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/analyzer", label: "Analyzer", icon: "🔍" },
  { href: "/riwayat", label: "Riwayat", icon: "📋" },
  { href: "/tentang", label: "Tentang", icon: "ℹ️" },
  { href: "/playground", label: "Playground", icon: "🧪" },
  { href: "/status", label: "Status Sistem", icon: "⚙️" },
  { href: "/debug", label: "Tampilan Debug", icon: "🐛" },
];

export default function SideNavBar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-[180px] min-h-screen bg-ckck-bg border-r border-ckck-border fixed left-0 top-0 z-30">
      <div className="p-4 border-b border-ckck-border">
        <h1 className="font-mono font-bold text-lg text-ckck-accent tracking-widest">
          CkCk
        </h1>
        <p className="font-mono text-[10px] uppercase tracking-widest text-ckck-text-muted mt-1">
          FORENSIC ANALYST
        </p>
      </div>

      <nav className="flex-1 py-2">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm transition-colors ${
                active
                  ? "border-l-2 border-ckck-accent text-ckck-accent bg-ckck-accent/5"
                  : "border-l-2 border-transparent text-ckck-text-muted hover:text-ckck-text-primary"
              }`}
            >
              <span className="text-sm">{item.icon}</span>
              <span className="font-mono text-xs uppercase tracking-wider">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-ckck-border">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-ckck-accent animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-ckck-accent">
            OFFLINE
          </span>
        </div>
      </div>
    </aside>
  );
}
