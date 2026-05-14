"use client";

import type { InferenceStatus } from "@/lib/types";

const STATUS_STYLES: Record<InferenceStatus, { bg: string; text: string; label: string }> = {
  WASPADAI: { bg: "bg-status-waspadai-bg", text: "text-status-waspadai-text", label: "WASPADAI" },
  TERVERIFIKASI: { bg: "bg-status-terverifikasi-bg", text: "text-status-terverifikasi-text", label: "TERVERIFIKASI" },
  KONTEKS_BERBEDA: { bg: "bg-status-konteks-bg", text: "text-status-konteks-text", label: "KONTEKS BERBEDA" },
  NETRAL: { bg: "bg-status-netral-bg", text: "text-status-netral-text", label: "NETRAL" },
};

export default function StatusBadge({ status }: { status: InferenceStatus }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.NETRAL;
  return (
    <span
      className={`${style.bg} ${style.text} px-3 py-1 rounded font-mono text-xs uppercase tracking-widest font-bold`}
    >
      {style.label}
    </span>
  );
}
