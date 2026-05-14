"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/analyzer", label: "Analyzer", icon: "🔍" },
  { href: "/riwayat", label: "Riwayat", icon: "📋" },
  { href: "/playground", label: "Play", icon: "🧪" },
  { href: "/status", label: "Status", icon: "⚙️" },
  { href: "/debug", label: "Debug", icon: "🐛" },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-ckck-bg border-t border-ckck-border flex justify-around py-2">
      {ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 ${
              active ? "text-ckck-accent" : "text-ckck-text-muted"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-mono text-[9px] uppercase tracking-wider">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
