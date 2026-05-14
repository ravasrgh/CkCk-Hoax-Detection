"use client";

import { useEffect, useRef, ReactNode } from "react";

type Direction = "left" | "right" | "up";

interface Props {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  className?: string;
}

export default function ScrollReveal({ children, direction = "up", delay = 0, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.animationDelay = `${delay}ms`;
          el.classList.add("sr-visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`sr-hidden sr-${direction} ${className}`}>
      {children}
    </div>
  );
}
