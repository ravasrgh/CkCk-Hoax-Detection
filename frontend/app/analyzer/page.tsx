"use client";

import { Fragment, Suspense, useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { InferenceResult, StageInfo, SSEEvent, PipelineStage } from "@/lib/types";
import { streamAnalysis } from "@/lib/api";
import MediaUploader from "@/components/analyzer/MediaUploader";
import PipelineProgress from "@/components/analyzer/PipelineProgress";
import ResultCard from "@/components/analyzer/ResultCard";
import OfflineBadge from "@/components/ui/OfflineBadge";

const INITIAL_STAGES: StageInfo[] = [
  { name: "PII FILTER", key: "pii_filter", status: "pending" },
  { name: "INDOBERT", key: "indobert", status: "pending" },
  { name: "RULE-BASED", key: "rule_based", status: "pending" },
  { name: "OUTPUT", key: "output", status: "pending" },
];

const STEPS = [
  { label: "Upload atau ketik konten" },
  { label: "AI menganalisis secara lokal" },
  { label: "Dapatkan hasil & penjelasan" },
];

type PageState = "idle" | "analyzing" | "result";

function AnalyzerContent() {
  const searchParams = useSearchParams();
  const sampleText = searchParams.get("sample") || "";

  const [state, setState] = useState<PageState>("idle");
  const [stages, setStages] = useState<StageInfo[]>(INITIAL_STAGES);
  const [result, setResult] = useState<InferenceResult | null>(null);
  const [totalMs, setTotalMs] = useState(0);
  const [error, setError] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [inputCaption, setInputCaption] = useState("");
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const stageTimers = useRef<Record<string, number>>({});

  useEffect(() => {
    if (sampleText) {
      setState("idle");
    }
  }, [sampleText]);

  const updateStage = (key: PipelineStage, status: "running" | "complete") => {
    setStages((prev) =>
      prev.map((s) => {
        if (s.key === key) {
          const timeMs =
            status === "complete" && stageTimers.current[key]
              ? Math.round(performance.now() - stageTimers.current[key])
              : s.timeMs;
          return { ...s, status, timeMs };
        }
        return s;
      })
    );
    if (status === "running") {
      stageTimers.current[key] = performance.now();
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setInputCaption((formData.get("caption") as string) || "");
    setState("analyzing");
    setError("");
    setResult(null);
    setStages(INITIAL_STAGES.map((s) => ({ ...s, status: "pending", timeMs: undefined })));
    stageTimers.current = {};

    let lastStage: PipelineStage | null = null;

    await streamAnalysis(
      formData,
      (event: SSEEvent) => {
        const stageKey = event.stage as PipelineStage;

        if (lastStage && lastStage !== stageKey && stageKey !== "complete") {
          updateStage(lastStage, "complete");
        }

        if (stageKey !== "upload_received" && stageKey !== "complete") {
          updateStage(stageKey, "running");
          lastStage = stageKey;
        }
      },
      (inferenceResult: InferenceResult, ms: number) => {
        if (lastStage) updateStage(lastStage, "complete");
        setStages((prev) => prev.map((s) => ({ ...s, status: "complete" as const })));
        setResult(inferenceResult);
        setTotalMs(ms);
        setState("result");
        setHasAnalyzed(true);
      },
      (err: string) => {
        setError(err);
        setState("idle");
      }
    );
  };

  const handleReset = () => {
    setState("idle");
    setResult(null);
    setError("");
    setUploadedFile(null);
    setStages(INITIAL_STAGES.map((s) => ({ ...s, status: "pending", timeMs: undefined })));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xs uppercase tracking-widest font-sans font-semibold" style={{ color: "var(--text-slogan)" }}>
            Analisis Konten
          </h1>
          <p className="text-sm mt-1 font-sans" style={{ color: "var(--text-muted)" }}>
            Deteksi hoaks dengan AI — sepenuhnya offline
          </p>
        </div>
        <OfflineBadge />
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: "var(--waspadai-bg)", border: "1px solid var(--waspadai-border)" }}>
          <p className="text-sm font-sans" style={{ color: "var(--waspadai-text)" }}>{error}</p>
        </div>
      )}

      {state === "idle" && (
        <>
          {!hasAnalyzed && (
            <div className="mb-8 space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-serif font-bold mb-3" style={{ color: "var(--text-primary)" }}>
                  Cek sebelum kamu sebar.
                </h2>
                <p className="text-sm font-sans leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  CkCk menganalisis teks, gambar, dan video untuk mendeteksi pola hoaks<br />
                  — sepenuhnya offline, tanpa data keluar dari perangkatmu.
                </p>
              </div>
              <div className="flex items-start justify-center gap-6 text-center">
                {STEPS.map((step, i) => (
                  <Fragment key={i}>
                    <div className="flex flex-col items-center gap-2 max-w-100">
                      <span className="text-[11px] font-sans font-medium leading-tight" style={{ color: "var(--text-muted)" }}>
                        {step.label}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <span className="mt-3 font-sans text-sm" style={{ color: "var(--text-dimmer)" }}>→</span>
                    )}
                  </Fragment>
                ))}
              </div>
            </div>
          )}
          <MediaUploader
            onSubmit={handleSubmit}
            initialCaption={sampleText}
            onFileChange={setUploadedFile}
          />
        </>
      )}

      {state === "analyzing" && (
        <div className="space-y-6">
          <PipelineProgress stages={stages} />
          <p className="text-center text-sm font-sans animate-pulse" style={{ color: "var(--text-muted)" }}>
            Menganalisis konten...
          </p>
        </div>
      )}

      {state === "result" && result && (
        <ResultCard
          result={result}
          stages={stages}
          totalMs={totalMs}
          onReset={handleReset}
          uploadedFile={uploadedFile ?? undefined}
          inputCaption={inputCaption}
        />
      )}
    </div>
  );
}

export default function AnalyzerPage() {
  return (
    <Suspense>
      <AnalyzerContent />
    </Suspense>
  );
}
