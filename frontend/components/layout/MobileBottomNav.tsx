"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/analyzer", label: "Analyzer", icon: "🔍" },
  { href: "/riwayat", label: "Riwayat", icon: "📋" },
  { href: "/playground", label: "Play", icon: "🧪" },
  { href: "/status", label: "Status", icon: "⚙️" },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-[#3A342B] flex justify-around py-2 h-14"
      style={{ backgroundColor: "#27231d" }}
    >
      {ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 font-sora ${
              active ? "text-[#c7bcaa]" : "text-[#D5C4AF]"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-[9px] uppercase tracking-wider font-medium">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
