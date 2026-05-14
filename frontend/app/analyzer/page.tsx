"use client";

import { useState, useRef, useEffect } from "react";
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

type PageState = "idle" | "analyzing" | "result";

export default function AnalyzerPage() {
  const searchParams = useSearchParams();
  const sampleText = searchParams.get("sample") || "";

  const [state, setState] = useState<PageState>("idle");
  const [stages, setStages] = useState<StageInfo[]>(INITIAL_STAGES);
  const [result, setResult] = useState<InferenceResult | null>(null);
  const [totalMs, setTotalMs] = useState(0);
  const [error, setError] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xs uppercase tracking-widest text-[#9A9080] font-sora font-semibold">
            ANALISIS KONTEN
          </h1>
          <p className="text-sm text-[#9A9080] mt-1 font-sora">
            Deteksi hoaks dengan AI — sepenuhnya offline
          </p>
        </div>
        <OfflineBadge />
      </div>

      {error && (
        <div className="mb-4 p-4 bg-[#3D0D0A] border border-[#C8352A]/30">
          <p className="text-[#FFDAD6] text-sm font-sora">{error}</p>
        </div>
      )}

      {state === "idle" && (
        <MediaUploader
          onSubmit={handleSubmit}
          initialCaption={sampleText}
          onFileChange={setUploadedFile}
        />
      )}

      {state === "analyzing" && (
        <div className="space-y-4">
          <PipelineProgress stages={stages} />
          <p className="text-center text-sm text-[#9A9080] font-sora animate-pulse">
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
        />
      )}
    </div>
  );
}
