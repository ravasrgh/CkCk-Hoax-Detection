"use client";

import type { StageInfo } from "@/lib/types";

interface Props {
  stages: StageInfo[];
}

export default function PipelineProgress({ stages }: Props) {
  return (
    <div className="border border-[#2C2820] bg-[#1A1712] p-4">
      <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#9A9080] mb-4 font-sans">
        PIPELINE ANALISIS
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {stages.map((stage, i) => (
          <div key={stage.key} className="flex items-center gap-2">
            <div
              className={`flex items-center gap-2 px-3 py-2 border text-xs uppercase tracking-wider transition-all font-sans ${
                stage.status === "complete"
                  ? "border-[#E8A838] text-[#E8A838] bg-[#E8A838]/5"
                  : stage.status === "running"
                  ? "border-[#E8A838] text-[#E8A838] animate-pulse-amber"
                  : "border-[#2C2820] text-[#9A9080] opacity-40"
              }`}
            >
              {stage.status === "complete" && (
                <span className="text-[#E8A838]">✓</span>
              )}
              {stage.status === "running" && (
                <span className="inline-block w-3 h-3 border-2 border-[#E8A838] border-t-transparent rounded-full animate-spin" />
              )}
              <span>{stage.name}</span>
              {stage.status === "complete" && stage.timeMs !== undefined && (
                <span className="text-[#9A9080] text-[10px]">
                  {stage.timeMs}ms
                </span>
              )}
            </div>
            {i < stages.length - 1 && (
              <span className="text-[#9A9080] text-xs">→</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
