"use client";

import { useState, useEffect } from "react";
import type { SystemStatus } from "@/lib/types";
import { getStatus } from "@/lib/api";

export default function StatusPage() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await getStatus();
        setStatus(data);
        setConnected(true);
        setError("");
      } catch {
        setConnected(false);
        setError("Backend tidak tersedia.");
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: "MODEL DIMUAT", value: status?.model_loaded ? "YA" : "TIDAK" },
    { label: "UKURAN MODEL", value: status ? `${status.model_size_mb} MB` : "—" },
    { label: "PERANGKAT", value: status?.device || "—" },
    { label: "TOTAL ANALISIS SESI", value: status?.total_analisis_sesi?.toString() || "0" },
    { label: "RATA-RATA WAKTU INFERENSI", value: status ? `${status.avg_inference_ms}ms` : "—" },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-mono text-xs uppercase tracking-widest text-ckck-text-muted mb-6">
        STATUS SISTEM
      </h1>

      {error && (
        <p className="text-status-waspadai-text text-sm font-mono mb-4">{error}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-ckck-card border border-ckck-border rounded-lg p-4"
          >
            <p className="font-mono text-[10px] uppercase tracking-widest text-ckck-text-muted">
              {stat.label}
            </p>
            <p className="font-mono text-2xl font-bold text-ckck-text-primary mt-1">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full ${
            connected ? "bg-green-500" : "bg-status-waspadai-text"
          }`}
        />
        <span className="font-mono text-xs uppercase tracking-widest text-ckck-text-muted">
          {connected
            ? `TERHUBUNG KE ${status?.backend_url || "LOCALHOST:8000"}`
            : "TIDAK TERHUBUNG"}
        </span>
      </div>
    </div>
  );
}
