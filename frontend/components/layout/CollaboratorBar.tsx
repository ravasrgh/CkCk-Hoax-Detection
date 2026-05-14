"use client";

import Image from "next/image";
import { useSidebar } from "@/lib/sidebarContext";
import { usePathname } from "next/navigation";

const LOGOS = [
  { src: "/images/AiConnect.png", alt: "AI Connect" },
  { src: "/images/DTETI.png", alt: "DTETI UGM" },
  { src: "/images/ugm.png", alt: "Universitas Gadjah Mada" },
  { src: "/images/FINDIT.png", alt: "FINDIT" },
];

export default function CollaboratorBar() {
  const { open } = useSidebar();
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <div
      className="fixed bottom-0 right-0 z-20 border-t border-[#2C2820] px-4 hidden md:flex items-center transition-[left] duration-300 ease-in-out"
      style={{
        backgroundColor: "#1e1a13",
        height: "4vh",
        minHeight: "28px",
        maxHeight: "40px",
        left: open && !isHome ? 220 : 0,
      }}
    >
      <div className="flex items-center gap-3">
        <span className="text-[#9A9080] text-[10px] font-sora whitespace-nowrap">
          Berkolaborasi dengan:
        </span>
        <div className="flex items-center gap-3">
          {LOGOS.map((logo) => (
            <div key={logo.alt} className="relative h-4 w-auto opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
              <Image
                src={logo.src}
                alt={logo.alt}
                height={16}
                width={56}
                className="h-4 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
