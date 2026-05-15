"use client";

import { useState, useEffect } from "react";
import type { SessionEntry, InferenceResult, StageInfo } from "@/lib/types";
import { getHistory, clearHistory, getHistoryEntry } from "@/lib/api";
import StatusBadge from "@/components/ui/StatusBadge";
import ResultCard from "@/components/analyzer/ResultCard";

const TYPE_LABELS: Record<string, string> = {
  text: "TEKS",
  image: "GAMBAR",
  video: "VIDEO",
  audio: "AUDIO",
};

const COMPLETED_STAGES: StageInfo[] = [
  { name: "PII FILTER", key: "pii_filter", status: "complete" },
  { name: "INDOBERT", key: "indobert", status: "complete" },
  { name: "RULE-BASED", key: "rule_based", status: "complete" },
  { name: "OUTPUT", key: "output", status: "complete" },
];

export default function RiwayatPage() {
  const [history, setHistory] = useState<SessionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<SessionEntry | null>(null);
  const [selectedResult, setSelectedResult] = useState<InferenceResult | null>(null);
  const [loadingEntry, setLoadingEntry] = useState(false);

  const fetchHistory = async () => {
    try {
      const data = await getHistory();
      setHistory(data);
      setError("");
    } catch {
      setError("Backend tidak tersedia.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleClear = async () => {
    try {
      await clearHistory();
      setHistory([]);
    } catch {
      setError("Gagal menghapus riwayat.");
    }
  };

  const handleSelectEntry = async (entry: SessionEntry) => {
    setSelectedEntry(entry);
    setSelectedResult(null);
    setLoadingEntry(true);
    try {
      const result = await getHistoryEntry(entry.id);
      setSelectedResult(result);
    } catch {
      setError("Gagal memuat detail analisis.");
      setSelectedEntry(null);
    } finally {
      setLoadingEntry(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedEntry(null);
    setSelectedResult(null);
    setLoadingEntry(false);
  };

  const totalMs = selectedResult
    ? ((selectedResult.metadata_media as Record<string, number>)?.inference_time_ms ?? 0)
    : 0;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-mono text-xs uppercase tracking-widest text-ckck-text-muted">
            RIWAYAT ANALISIS
          </h1>
          <p className="text-xs text-ckck-text-muted mt-1">
            Riwayat hanya tersedia selama sesi ini — tidak ada yang disimpan permanen.
          </p>
        </div>
        {history.length > 0 && (
          <button
            onClick={handleClear}
            className="px-3 py-1.5 rounded border border-ckck-border font-mono text-[10px] uppercase tracking-widest text-status-waspadai-text hover:border-status-waspadai-text transition-colors"
          >
            Hapus Riwayat
          </button>
        )}
      </div>

      {error && (
        <p className="text-status-waspadai-text text-sm font-mono mb-4">{error}</p>
      )}

      {loading ? (
        <p className="text-center text-ckck-text-muted text-sm py-12">Memuat...</p>
      ) : history.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-ckck-text-muted font-mono text-sm">
            Belum ada analisis dalam sesi ini
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((entry) => {
            const borderColor =
              entry.status === "WASPADAI"
                ? "border-l-status-waspadai-text"
                : entry.status === "TERVERIFIKASI"
                ? "border-l-status-terverifikasi-text"
                : entry.status === "KONTEKS_BERBEDA"
                ? "border-l-status-konteks-text"
                : "border-l-status-netral-text";

            return (
              <div
                key={entry.id}
                onClick={() => handleSelectEntry(entry)}
                className={`bg-ckck-card border border-ckck-border border-l-4 ${borderColor} rounded-lg p-4 cursor-pointer hover:bg-ckck-border/30 transition-colors`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-ckck-text-primary truncate">
                      {entry.input_preview || "—"}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <StatusBadge status={entry.status} />
                      <span className="px-2 py-0.5 rounded bg-ckck-border font-mono text-[10px] uppercase tracking-widest text-ckck-text-code">
                        {TYPE_LABELS[entry.input_type] || entry.input_type.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono text-[10px] text-ckck-text-muted whitespace-nowrap">
                      {new Date(entry.timestamp).toLocaleTimeString("id-ID")}
                    </span>
                    <span className="text-ckck-text-muted text-xs">›</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL DETAIL ANALISIS */}
      {selectedEntry && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 overflow-y-auto py-6 px-4"
          onClick={(e) => { if (e.target === e.currentTarget) handleCloseModal(); }}
        >
          <div className="w-full max-w-2xl bg-ckck-bg border border-ckck-border rounded-lg overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-ckck-border">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-ckck-text-muted">
                  DETAIL ANALISIS
                </p>
                <p className="text-xs text-ckck-text-muted mt-0.5">
                  {new Date(selectedEntry.timestamp).toLocaleString("id-ID")}
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="w-8 h-8 flex items-center justify-center rounded border border-ckck-border text-ckck-text-muted hover:text-ckck-text-primary hover:border-ckck-text-muted transition-colors font-mono text-sm"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4">
              {loadingEntry ? (
                <div className="text-center py-16">
                  <p className="text-ckck-text-muted font-mono text-sm">Memuat detail...</p>
                </div>
              ) : selectedResult ? (
                <ResultCard
                  result={selectedResult}
                  stages={COMPLETED_STAGES}
                  totalMs={totalMs}
                  onReset={handleCloseModal}
                  inputCaption={selectedEntry.input_preview}
                />
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
