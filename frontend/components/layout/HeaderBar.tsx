"use client";

import Image from "next/image";

export default function HeaderBar() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-start h-[42px] px-4"
      style={{
        backgroundColor: "#27231d",
        borderBottom: "1px solid #27241e",
      }}
    >
      <Image
        src="/images/CkckLogodark.png"
        alt="CkCk Logo"
        width={80}
        height={28}
        className="object-contain"
        priority
      />
      <span
        className="text-xs tracking-widest uppercase font-sora font-medium ml-3"
        style={{ color: "#c7bcaa" }}
      >
        Privacy Aware Hoax Detection AI
      </span>
    </header>
  );
}
