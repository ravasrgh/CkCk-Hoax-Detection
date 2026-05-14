"use client";

import { useState, useEffect } from "react";
import type { SessionEntry } from "@/lib/types";
import { getHistory } from "@/lib/api";

export default function DebugPage() {
  const [latest, setLatest] = useState<SessionEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const history = await getHistory();
        setLatest(history.length > 0 ? history[0] : null);
        setError("");
      } catch {
        setError("Backend tidak tersedia.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Warning Banner */}
      <div className="bg-status-waspadai-bg border border-status-waspadai-text/30 rounded-lg p-3 mb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-status-waspadai-text text-center">
          VIEW INI HANYA UNTUK KEPERLUAN DEMONSTRASI
        </p>
      </div>

      <h1 className="font-mono text-xs uppercase tracking-widest text-ckck-text-muted mb-6">
        TAMPILAN DEBUG
      </h1>

      {error && (
        <p className="text-status-waspadai-text text-sm font-mono mb-4">{error}</p>
      )}

      {loading ? (
        <p className="text-ckck-text-muted text-sm text-center py-12">Memuat...</p>
      ) : !latest ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🐛</p>
          <p className="text-ckck-text-muted font-mono text-sm">
            Belum ada analisis. Lakukan analisis terlebih dahulu.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Raw JSON */}
          <div className="bg-ckck-card border border-ckck-border rounded-lg p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-ckck-text-muted mb-3">
              BUFFER OUTPUT MENTAH
            </p>
            <pre className="font-mono text-xs text-ckck-text-code overflow-x-auto max-h-[400px] overflow-y-auto">
              {JSON.stringify(latest, null, 2)}
            </pre>
          </div>

          {/* Token Details */}
          <div className="bg-ckck-card border border-ckck-border rounded-lg p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-ckck-text-muted mb-3">
              RINCIAN TOKEN
            </p>
            <table className="w-full font-mono text-xs">
              <thead>
                <tr className="text-ckck-text-muted border-b border-ckck-border">
                  <th className="text-left py-2 pr-4">TOKEN</th>
                  <th className="text-left py-2 pr-4">TYPE</th>
                  <th className="text-right py-2">KONE</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-ckck-border/50">
                  <td className="py-2 pr-4 text-ckck-text-primary">{latest.status}</td>
                  <td className="py-2 pr-4 text-ckck-text-code">STATUS</td>
                  <td className="py-2 text-right text-ckck-accent">
                    {(latest.confidence_hoax * 100).toFixed(1)}%
                  </td>
                </tr>
                <tr className="border-b border-ckck-border/50">
                  <td className="py-2 pr-4 text-ckck-text-primary">{latest.input_type}</td>
                  <td className="py-2 pr-4 text-ckck-text-code">INPUT_TYPE</td>
                  <td className="py-2 text-right text-ckck-text-muted">—</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-ckck-text-primary truncate max-w-[200px]">
                    {latest.input_preview}
                  </td>
                  <td className="py-2 pr-4 text-ckck-text-code">PREVIEW</td>
                  <td className="py-2 text-right text-ckck-text-muted">—</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Rule Triggers */}
          <div className="bg-ckck-card border border-ckck-border rounded-lg p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-ckck-text-muted mb-3">
              PEMICU ATURAN
            </p>
            {latest.pola_terdeteksi.length > 0 ? (
              <div className="space-y-2">
                {latest.pola_terdeteksi.map((pola, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 py-1.5 border-b border-ckck-border/30 last:border-0"
                  >
                    <span className="text-status-waspadai-text text-xs">▶</span>
                    <span className="font-mono text-xs text-ckck-text-primary">
                      {pola}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-ckck-text-muted">
                Tidak ada pola manipulatif terdeteksi.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
