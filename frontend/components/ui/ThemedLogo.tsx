"use client";

import Image from "next/image";
import { useTheme } from "@/lib/themeContext";

interface Props {
  width?: number;
  height?: number;
  className?: string;
}

export default function ThemedLogo({ width = 280, height = 100, className = "" }: Props) {
  const { isDark } = useTheme();
  return (
    <Image
      src={isDark ? "/images/CkckLogodark.png" : "/images/CkckLogo.png"}
      alt="CkCk"
      width={width}
      height={height}
      className={className}
      priority
    />
  );
}
