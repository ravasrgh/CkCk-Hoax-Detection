"use client";

import Image from "next/image";
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
    <aside className="hidden md:flex flex-col w-[220px] min-h-screen bg-[#241F17] border-r border-[#3A342B] fixed left-0 top-0 z-30">
      {/* Top bar with logo */}
      <div className="h-[42px] bg-[#E8A838] flex items-center px-4">
        <Image
          src="/images/CkckLogo.png"
          alt="CkCk Logo"
          width={80}
          height={28}
          className="object-contain"
          priority
        />
      </div>

      <nav className="flex-1 py-2">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-3 text-sm transition-colors font-sora ${
                active
                  ? "bg-[#504535] border-l-[3px] border-[#E8A838] text-[#EDE1D4]"
                  : "border-l-[3px] border-transparent text-[#D5C4AF] hover:bg-[#504535]/50 hover:text-[#EDE1D4]"
              }`}
            >
              <span className="text-sm">{item.icon}</span>
              <span className="text-xs uppercase tracking-wide font-medium">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#3A342B]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FFC66B] animate-pulse" />
          <span className="text-[10px] uppercase tracking-widest text-[#E8A838] font-sora font-semibold">
            OFFLINE
          </span>
        </div>
      </div>
    </aside>
  );
}
