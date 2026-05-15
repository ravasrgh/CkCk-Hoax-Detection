"use client";

import Image from "next/image";
import Link from "next/link";
import { useSidebar } from "@/lib/sidebarContext";
import { useTheme } from "@/lib/themeContext";

export default function HeaderBar() {
  const { toggle, open } = useSidebar();
  const { isDark, toggle: toggleTheme } = useTheme();

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 flex items-center h-[42px] px-3 gap-3"
      style={{ backgroundColor: "var(--bg-header)", borderBottom: "1px solid var(--border-header)" }}
    >
      {/* Hamburger / toggle button */}
      <button
        onClick={toggle}
        className="flex flex-col justify-center items-center w-8 h-8 gap-[5px] rounded transition-colors shrink-0"
        style={{ ["--hover-bg" as string]: "var(--bg-sidebar-active)" }}
        title={open ? "Tutup sidebar" : "Buka sidebar"}
        aria-label="Toggle sidebar"
      >
        <span
          className="block h-[1.5px] rounded-full transition-all duration-300 origin-center"
          style={{
            width: 16,
            backgroundColor: "var(--accent-primary)",
            transform: open ? "translateY(6.5px) rotate(45deg)" : "none",
          }}
        />
        <span
          className="block h-[1.5px] rounded-full transition-all duration-300"
          style={{
            width: 16,
            backgroundColor: "var(--accent-primary)",
            opacity: open ? 0 : 1,
          }}
        />
        <span
          className="block h-[1.5px] rounded-full transition-all duration-300 origin-center"
          style={{
            width: 16,
            backgroundColor: "var(--accent-primary)",
            transform: open ? "translateY(-6.5px) rotate(-45deg)" : "none",
          }}
        />
      </button>

      {/* Logo */}
      <Link href="/" aria-label="Kembali ke halaman utama">
        <Image
          src={isDark ? "/images/CkckLogodark.png" : "/images/CkckLogo.png"}
          alt="CkCk Logo"
          width={72}
          height={26}
          className="object-contain"
          priority
        />
      </Link>

      <span
        className="text-xs tracking-widest uppercase font-sans font-medium"
        style={{ color: "var(--text-muted)" }}
      >
        Privacy Aware Hoax Detection AI
      </span>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="ml-auto flex items-center justify-center w-7 h-7 rounded transition-colors"
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        aria-label="Toggle theme"
      >
        <span className="text-sm">{isDark ? "☀️" : "🌙"}</span>
      </button>
    </header>
  );
}
