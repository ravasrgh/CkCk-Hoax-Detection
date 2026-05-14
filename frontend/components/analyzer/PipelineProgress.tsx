"use client";

import type { StageInfo } from "@/lib/types";

interface Props {
  stages: StageInfo[];
}

export default function PipelineProgress({ stages }: Props) {
  return (
    <div className="bg-ckck-card border border-ckck-border rounded-lg p-6">
      <p className="font-mono text-xs uppercase tracking-widest text-ckck-text-muted mb-4">
        PIPELINE ANALISIS
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {stages.map((stage, i) => (
          <div key={stage.key} className="flex items-center gap-2">
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded border font-mono text-xs uppercase tracking-wider transition-all ${
                stage.status === "complete"
                  ? "border-ckck-accent text-ckck-accent bg-ckck-accent/5"
                  : stage.status === "running"
                  ? "border-ckck-accent text-ckck-accent animate-pulse-amber"
                  : "border-ckck-border text-ckck-text-muted opacity-40"
              }`}
            >
              {stage.status === "complete" && (
                <span className="text-ckck-accent">✓</span>
              )}
              {stage.status === "running" && (
                <span className="inline-block w-3 h-3 border-2 border-ckck-accent border-t-transparent rounded-full animate-spin" />
              )}
              <span>{stage.name}</span>
              {stage.status === "complete" && stage.timeMs !== undefined && (
                <span className="text-ckck-text-muted text-[10px]">
                  {stage.timeMs}ms
                </span>
              )}
            </div>
            {i < stages.length - 1 && (
              <span className="text-ckck-text-muted text-xs">→</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
