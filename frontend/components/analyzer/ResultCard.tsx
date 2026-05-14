"use client";

import { useState } from "react";
import type { InferenceResult, InferenceStatus, StageInfo } from "@/lib/types";
import PipelineProgress from "./PipelineProgress";

const STATUS_STYLES: Record<InferenceStatus, { bg: string; text: string; label: string }> = {
  WASPADAI: { bg: "bg-status-waspadai-bg", text: "text-status-waspadai-text", label: "WASPADAI" },
  TERVERIFIKASI: { bg: "bg-status-terverifikasi-bg", text: "text-status-terverifikasi-text", label: "TERVERIFIKASI" },
  KONTEKS_BERBEDA: { bg: "bg-status-konteks-bg", text: "text-status-konteks-text", label: "KONTEKS BERBEDA" },
  NETRAL: { bg: "bg-status-netral-bg", text: "text-status-netral-text", label: "NETRAL" },
};

interface Props {
  result: InferenceResult;
  stages: StageInfo[];
  totalMs: number;
  onReset: () => void;
}

export default function ResultCard({ result, stages, totalMs, onReset }: Props) {
  const [copied, setCopied] = useState(false);
  const style = STATUS_STYLES[result.status] || STATUS_STYLES.NETRAL;
  const confidence = Math.round(result.confidence_hoax * 100);

  const handleCopy = async () => {
    const text = [
      `Status: ${style.label}`,
      `Tingkat Keyakinan: ${confidence}%`,
      `Penjelasan: ${result.penjelasan}`,
      result.pola_terdeteksi.length > 0
        ? `Pola: ${result.pola_terdeteksi.join(", ")}`
        : "",
      `Waktu: ${totalMs}ms`,
      "",
      "Dianalisis oleh CkCk — 100% Offline",
    ]
      .filter(Boolean)
      .join("\n");

    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inferenceMs = (result.metadata_media as Record<string, number>)?.inference_time_ms;
  const piiCount = (result.metadata_media as Record<string, number>)?.pii_count ?? 0;

  return (
    <div className="space-y-4">
      {/* Status Header */}
      <div className={`${style.bg} rounded-lg p-6`}>
        <p className={`font-mono text-xs uppercase tracking-widest ${style.text} mb-1`}>
          STATUS ANALISIS
        </p>
        <h2 className={`font-mono font-bold text-2xl ${style.text}`}>
          {style.label}
        </h2>
        <p className={`font-mono text-4xl font-bold ${style.text} mt-2`}>
          {confidence}%
        </p>
        <p className="font-mono text-xs text-ckck-text-muted mt-1 uppercase tracking-widest">
          TINGKAT KEYAKINAN
        </p>
      </div>

      {/* Pipeline Summary */}
      <PipelineProgress stages={stages} />

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-ckck-card border border-ckck-border rounded-lg p-4">
          <p className="font-mono text-xs uppercase tracking-widest text-ckck-text-muted">
            SKOR KEPERCAYAAN
          </p>
          <p className="font-mono text-2xl font-bold text-ckck-text-primary mt-1">
            {confidence}%
          </p>
          <p className="font-mono text-xs text-ckck-text-muted mt-1">
            Total: {inferenceMs ?? totalMs}ms
          </p>
        </div>
        <div className="bg-ckck-card border border-ckck-border rounded-lg p-4">
          <p className="font-mono text-xs uppercase tracking-widest text-ckck-text-muted">
            DATA PRIBADI DILINDUNGI
          </p>
          {result.pii_disensor ? (
            <div className="flex flex-wrap gap-1 mt-2">
              {piiCount > 0 && (
                <span className="px-2 py-0.5 rounded bg-ckck-border font-mono text-[10px] uppercase text-ckck-accent">
                  {piiCount} DIPROTEKSI
                </span>
              )}
            </div>
          ) : (
            <p className="text-sm text-ckck-text-muted mt-2">
              Tidak ada PII terdeteksi
            </p>
          )}
        </div>
      </div>

      {/* Pola Linguistik */}
      {result.pola_terdeteksi.length > 0 && (
        <div className="bg-ckck-card border border-ckck-border rounded-lg p-4">
          <p className="font-mono text-xs uppercase tracking-widest text-ckck-text-muted mb-3">
            POLA LINGUISTIK
          </p>
          <div className="flex flex-wrap gap-2">
            {result.pola_terdeteksi.map((pola, i) => (
              <span
                key={i}
                className="px-2 py-1 rounded bg-status-waspadai-bg/50 text-status-waspadai-text font-mono text-xs"
              >
                {pola}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Penjelasan */}
      <div className="bg-ckck-card border border-ckck-border rounded-lg p-4">
        <p className="font-mono text-xs uppercase tracking-widest text-ckck-text-muted mb-2">
          MENGAPA INI MENCURIGAKAN?
        </p>
        <p className="text-sm text-ckck-text-primary leading-relaxed">
          {result.penjelasan}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onReset}
          className="flex-1 py-3 rounded-lg border border-ckck-border font-mono text-xs uppercase tracking-widest text-ckck-text-primary hover:border-ckck-accent transition-colors"
        >
          ↺ ANALISIS ULANG
        </button>
        <button
          onClick={handleCopy}
          className="flex-1 py-3 rounded-lg border border-ckck-border font-mono text-xs uppercase tracking-widest text-ckck-text-primary hover:border-ckck-accent transition-colors"
        >
          {copied ? "✓ TERSALIN!" : "⎘ SALIN HASIL"}
        </button>
      </div>

      {/* Privacy Footer */}
      <p className="text-center text-xs text-ckck-text-muted font-mono">
        🔒 Analisis dilakukan sepenuhnya di perangkat ini. Tidak ada data yang dikirim ke server eksternal.
      </p>
    </div>
  );
}
