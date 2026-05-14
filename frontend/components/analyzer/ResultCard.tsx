"use client";

import { useState } from "react";
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

export default function ResultCard({
  result,
  stages,
  totalMs,
  onReset,
  uploadedFile,
  inputCaption,
}: Props) {
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
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase font-sora mb-1" style={{ color: style.text, opacity: 0.7 }}>
              STATUS ANALISIS
            </p>
            <h2
              className="text-[2rem] font-bold uppercase tracking-wide font-sora leading-tight"
              style={{ color: style.text }}
            >
              {style.label}
            </h2>
            <div className="flex items-baseline gap-2 mt-2">
              <span
                className="text-[2.5rem] font-bold font-sora leading-none"
                style={{ color: style.text }}
              >
                {confidence}%
              </span>
              <span
                className="text-[10px] font-semibold tracking-[0.15em] uppercase font-sora"
                style={{ color: style.text, opacity: 0.7 }}
              >
                TINGKAT KEYAKINAN
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. KONTEN YANG DIANALISIS */}
      <div className="border border-[#2C2820] bg-[#120D07] p-4">
        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#9A9080] mb-3 font-sora">
          KONTEN YANG DIANALISIS
        </p>

        {/* Show uploaded image preview */}
        {uploadedFile && uploadedFile.type.startsWith("image/") && (
          <img
            src={URL.createObjectURL(uploadedFile)}
            className="max-h-60 mb-3 border border-[#2C2820] rounded"
            alt="Konten yang dianalisis"
          />
        )}

        {/* Show uploaded video player */}
        {uploadedFile && uploadedFile.type.startsWith("video/") && (
          <div className="mb-3">
            <video
              src={URL.createObjectURL(uploadedFile)}
              controls
              className="max-h-60 w-full border border-[#2C2820] rounded"
            />
          </div>
        )}

        {/* Show uploaded audio player */}
        {uploadedFile && uploadedFile.type.startsWith("audio/") && (
          <div className="mb-3">
            <div className="flex items-center gap-2 text-[#D5C4AF] text-sm mb-2">
              <span>🔊</span>
              <span className="font-sora">{uploadedFile.name}</span>
            </div>
            <audio
              src={URL.createObjectURL(uploadedFile)}
              controls
              className="w-full"
            />
          </div>
        )}

        {/* Show user's input text */}
        {inputCaption && inputCaption.trim() && (
          <p className="text-[#EDE1D4] text-sm leading-relaxed font-sora whitespace-pre-wrap break-words">
            {inputCaption}
          </p>
        )}

        {/* Show OCR extracted text for image/video */}
        {uploadedFile && (uploadedFile.type.startsWith("image/") || uploadedFile.type.startsWith("video/")) && (
          <div className="mt-3 p-3 bg-[#1A1712] border border-[#2C2820] rounded">
            <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#9A9080] mb-2 font-sora">
              📝 TEKS DIEKSTRAK (OCR)
            </p>
            <p className="text-[#D5C4AF] text-sm leading-relaxed font-sora whitespace-pre-wrap break-words">
              {(result as Record<string, unknown>).teks_yang_dianalisis as string ||
                "Teks berhasil diekstrak dari konten."}
            </p>
          </div>
        )}

        {/* Show text-only fallback when no file uploaded and no caption */}
        {!uploadedFile && (!inputCaption || !inputCaption.trim()) && (
          <p className="text-[#D5C4AF] text-sm leading-relaxed font-sora whitespace-pre-wrap break-words">
            {(result as Record<string, unknown>).teks_yang_dianalisis as string ||
              "Teks berhasil diekstrak dari konten."}
          </p>
        )}

        {result.sumber_teks && result.sumber_teks.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {result.sumber_teks.map((src) => (
              <span
                key={src}
                className="text-[10px] px-2 py-0.5 bg-[#241F17] text-[#9A9080] border border-[#2C2820] font-sora"
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
        <div className="bg-[#1A1712] p-4">
          <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#9A9080] font-sora">
            SKOR KEPERCAYAAN
          </p>
          <p className="text-[2.5rem] font-bold font-sora leading-none mt-2" style={{ color: style.text }}>
            {confidence}%
          </p>
          <p className="text-xs text-[#9A9080] mt-1 font-sora">
            Total: {inferenceMs ?? totalMs}ms
          </p>
        </div>
        <div className="bg-[#1A1712] p-4">
          <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#9A9080] font-sora">
            DATA PRIBADI DILINDUNGI
          </p>
          {result.pii_disensor && piiCount > 0 ? (
            <div className="flex flex-wrap gap-1 mt-2">
              <span className="px-2 py-0.5 bg-[#241F17] border border-[#2C2820] text-[10px] uppercase text-[#FFC66B] font-sora">
                {piiCount} DIPROTEKSI
              </span>
              {piiDetails?.slice(0, 3).map((pii, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-[#241F17] border border-[#2C2820] text-[10px] uppercase text-[#9A9080] font-sora"
                >
                  {pii.type}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#9A9080] mt-2 font-sora">
              Tidak ada PII terdeteksi
            </p>
          )}
        </div>
      </div>

      {/* 5. POLA LINGUISTIK */}
      {result.pola_terdeteksi.length > 0 && (
        <PolaLinguistik pola={result.pola_terdeteksi} status={result.status} />
      )}

      {/* 6. MENGAPA INI MENCURIGAKAN? */}
      <div className="border border-[#2C2820] bg-[#1A1712] p-4">
        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#9A9080] mb-2 font-sora">
          MENGAPA INI MENCURIGAKAN?
        </p>
        <p className="text-sm text-[#D5C4AF] leading-relaxed font-sora">
          {result.penjelasan}
        </p>
      </div>

      {/* 7. AKSI CEPAT */}
      <AksiCepat status={result.status} />

      {/* 8. TOMBOL AKSI (2 kolom) */}
      <div className="grid grid-cols-2 gap-px bg-[#2C2820]">
        <button
          onClick={onReset}
          className="h-[46px] bg-[#1A1712] hover:bg-[#241F17] border-r border-[#2C2820] text-xs font-bold tracking-[0.15em] uppercase text-[#D5C4AF] hover:text-[#EDE1D4] transition-colors font-sora"
        >
          ↺ ANALISIS ULANG
        </button>
        <button
          onClick={handleCopy}
          className="h-[45px] bg-[#1A1712] hover:bg-[#241F17] text-xs font-bold tracking-[0.15em] uppercase text-[#D5C4AF] hover:text-[#EDE1D4] transition-colors font-sora"
        >
          {copied ? "✓ TERSALIN!" : "⎘ SALIN HASIL"}
        </button>
      </div>

      {/* 9. FOOTER PRIVASI */}
      <p className="text-center text-xs text-[#9A9080] font-sora py-2">
        🔒 Analisis dilakukan sepenuhnya di perangkat ini. Data tidak pernah keluar.
      </p>
    </div>
  );
}
