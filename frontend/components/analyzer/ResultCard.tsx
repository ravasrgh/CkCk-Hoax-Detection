"use client";

import { useState, useEffect } from "react";
import type { InferenceResult, StageInfo } from "@/lib/types";
import { STATUS_STYLES } from "@/lib/statusStyles";
import PipelineProgress from "./PipelineProgress";
import PolaLinguistik from "./PolaLinguistik";
import AksiCepat from "./AksiCepat";

interface Props {
  result: InferenceResult;
  stages: StageInfo[];
  totalMs: number;
  onReset: () => void;
  uploadedFile?: File;
  inputCaption?: string;
}

const CIRCUMFERENCE = 2 * Math.PI * 40; // r=40

function ConfidenceGauge({ confidence, color }: { confidence: number; color: string }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimated(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const offset = animated
    ? CIRCUMFERENCE * (1 - confidence / 100)
    : CIRCUMFERENCE;

  return (
    <svg viewBox="0 0 100 100" width="96" height="96" className="block mx-auto">
      {/* Track */}
      <circle
        cx="50" cy="50" r="40"
        fill="none"
        stroke="#2C2820"
        strokeWidth="8"
      />
      {/* Fill */}
      <circle
        cx="50" cy="50" r="40"
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
        transform="rotate(-90 50 50)"
        style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
      />
      {/* Label */}
      <text
        x="50" y="50"
        dominantBaseline="central"
        textAnchor="middle"
        fontSize="18"
        fontWeight="700"
        fontFamily="var(--font-sans, sans-serif)"
        fill={color}
      >
        {confidence}%
      </text>
    </svg>
  );
}

export default function ResultCard({
  result,
  stages,
  totalMs,
  onReset,
  uploadedFile,
  inputCaption,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
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

  const inferenceMs = (result.metadata_media as Record<string, number>)
    ?.inference_time_ms;
  const piiCount =
    (result.metadata_media as Record<string, number>)?.pii_count ?? 0;
  const piiDetails = (
    result.metadata_media as Record<string, unknown>
  )?.pii_details as Array<{ type: string; value?: string }> | undefined;

  return (
    <div className="space-y-3">
      {/* 1. STATUS HEADER */}
      <div
        className="p-6"
        style={{ backgroundColor: style.headerBg }}
      >
        <div className="flex items-start gap-4">
          <span
            className="text-3xl font-bold mt-1"
            style={{ color: style.iconColor }}
          >
            {style.icon}
          </span>
          <div className="flex-1">
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase font-sans mb-1" style={{ color: style.text, opacity: 0.7 }}>
              STATUS ANALISIS
            </p>
            <h2
              className="text-[2rem] font-bold uppercase tracking-wide font-sans leading-tight"
              style={{ color: style.text }}
            >
              {style.label}
            </h2>
          </div>
        </div>
      </div>

      {/* 2. KONTEN YANG DIANALISIS */}
      <div className="border border-[#2C2820] bg-[#120D07] p-4">
        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#9A9080] mb-3 font-sans">
          KONTEN YANG DIANALISIS
        </p>

        {uploadedFile && uploadedFile.type.startsWith("image/") && (
          <img
            src={URL.createObjectURL(uploadedFile)}
            className="max-h-60 mb-3 border border-[#2C2820] rounded"
            alt="Konten yang dianalisis"
          />
        )}

        {uploadedFile && uploadedFile.type.startsWith("video/") && (
          <div className="mb-3">
            <video
              src={URL.createObjectURL(uploadedFile)}
              controls
              className="max-h-60 w-full border border-[#2C2820] rounded"
            />
          </div>
        )}

        {inputCaption && inputCaption.trim() && (
          <p className="text-[#EDE1D4] text-sm leading-relaxed font-sans whitespace-pre-wrap break-words">
            {inputCaption}
          </p>
        )}

        {uploadedFile && (uploadedFile.type.startsWith("image/") || uploadedFile.type.startsWith("video/")) && (
          <div className="mt-3 p-3 bg-[#1A1712] border border-[#2C2820] rounded">
            <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#9A9080] mb-2 font-sans">
              📝 TEKS DIEKSTRAK (OCR)
            </p>
            <p className="text-[#D5C4AF] text-sm leading-relaxed font-sans whitespace-pre-wrap break-words">
              {result.teks_yang_dianalisis || "Teks berhasil diekstrak dari konten."}
            </p>
          </div>
        )}

        {!uploadedFile && (!inputCaption || !inputCaption.trim()) && (
          <p className="text-[#D5C4AF] text-sm leading-relaxed font-sans whitespace-pre-wrap break-words">
            {result.teks_yang_dianalisis || "Teks berhasil diekstrak dari konten."}
          </p>
        )}

        {result.sumber_teks && result.sumber_teks.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {result.sumber_teks.map((src) => (
              <span
                key={src}
                className="text-[10px] px-2 py-0.5 bg-[#241F17] text-[#9A9080] border border-[#2C2820] font-sans"
              >
                [{src.toUpperCase()}]
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 3. PIPELINE SELESAI */}
      <PipelineProgress stages={stages} />

      {/* 4. SKOR & PII (2 kolom) */}
      <div className="grid grid-cols-2 gap-px bg-[#2C2820]">
        <div className="bg-[#1A1712] p-4 flex flex-col items-center justify-center">
          <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#9A9080] font-sans mb-3">
            KEMUNGKINAN HOAKS
          </p>
          <ConfidenceGauge confidence={confidence} color={style.gaugeColor} />
          <p className="text-xs text-[#9A9080] mt-2 font-sans">
            Total: {inferenceMs ?? totalMs}ms
          </p>
        </div>
        <div className="bg-[#1A1712] p-4">
          <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#9A9080] font-sans">
            DATA PRIBADI DILINDUNGI
          </p>
          {result.pii_disensor && piiCount > 0 ? (
            <div className="flex flex-wrap gap-1 mt-2">
              <span className="px-2 py-0.5 bg-[#241F17] border border-[#2C2820] text-[10px] uppercase text-[#FFC66B] font-sans">
                {piiCount} DIPROTEKSI
              </span>
              {piiDetails?.slice(0, 3).map((pii, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-[#241F17] border border-[#2C2820] text-[10px] uppercase text-[#9A9080] font-sans"
                >
                  {pii.type}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#9A9080] mt-2 font-sans">
              Tidak ada PII terdeteksi
            </p>
          )}
        </div>
      </div>

      {/* 4b. PROTECTED TEXT PREVIEW (If PII triggered) */}
      {result.pii_disensor && (
        <div className="border border-[#C8352A]/30 bg-[#3D0D0A]/20 p-4">
          <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#FFDAD6] mb-2 font-sans">
            🔒 TEKS TERLINDUNGI (PII DISENSOR)
          </p>
          <p className="text-[#FFDAD6] text-sm leading-relaxed font-sans whitespace-pre-wrap break-words italic">
            "{result.teks_aman}"
          </p>
          <p className="text-[9px] text-[#9A9080] mt-2 font-sans uppercase tracking-wider">
            Informasi sensitif telah diganti dengan karakter blok untuk keamanan Anda.
          </p>
        </div>
      )}

      {/* 5. POLA LINGUISTIK */}
      {result.pola_terdeteksi.length > 0 && (
        <PolaLinguistik pola={result.pola_terdeteksi} status={result.status} />
      )}

      {/* 6. MENGAPA INI MENCURIGAKAN? */}
      <div className="border border-[#2C2820] bg-[#1A1712] p-4">
        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#9A9080] mb-2 font-sans">
          MENGAPA INI MENCURIGAKAN?
        </p>
        <p className="text-sm text-[#D5C4AF] leading-relaxed font-sans">
          {result.penjelasan}
        </p>
      </div>

      {/* 7. AKSI CEPAT */}
      <AksiCepat status={result.status} />

      {/* 8. TOMBOL AKSI (2 kolom) */}
      <div className="grid grid-cols-2 gap-px bg-[#2C2820]">
        <button
          onClick={onReset}
          className="h-[46px] bg-[#1A1712] hover:bg-[#241F17] border-r border-[#2C2820] text-xs font-bold tracking-[0.15em] uppercase text-[#D5C4AF] hover:text-[#EDE1D4] transition-colors font-sans"
        >
          ↺ ANALISIS ULANG
        </button>
        <button
          onClick={handleCopy}
          className="h-[45px] bg-[#1A1712] hover:bg-[#241F17] text-xs font-bold tracking-[0.15em] uppercase text-[#D5C4AF] hover:text-[#EDE1D4] transition-colors font-sans"
        >
          {copied ? "✓ TERSALIN!" : "⎘ SALIN HASIL"}
        </button>
      </div>

      {/* 9. FOOTER PRIVASI */}
      <p className="text-center text-xs text-[#9A9080] font-sans py-2">
        🔒 Analisis dilakukan sepenuhnya di perangkat ini. Data tidak pernah keluar.
      </p>

      {/* 10. DEBUG TOGGLE */}
      <div>
        <button
          onClick={() => setShowDebug((v) => !v)}
          className="w-full h-[36px] bg-[#120D07] hover:bg-[#1A1712] border border-[#2C2820] text-[10px] font-semibold tracking-[0.15em] uppercase text-[#58524A] hover:text-[#9A9080] transition-colors font-sans"
        >
          {showDebug ? "▲ SEMBUNYIKAN DEBUG" : "▼ DEBUG"}
        </button>
        {showDebug && (
          <pre className="text-[10px] bg-[#0A0704] border border-[#2C2820] border-t-0 p-3 overflow-x-auto font-mono text-[#9A9080] whitespace-pre-wrap leading-relaxed">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
