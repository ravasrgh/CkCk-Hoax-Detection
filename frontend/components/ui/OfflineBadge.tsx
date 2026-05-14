"use client";

export default function OfflineBadge() {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-ckck-border bg-ckck-card">
      <span className="w-2 h-2 rounded-full bg-ckck-accent animate-pulse" />
      <span className="font-mono text-xs uppercase tracking-widest text-ckck-accent">
        OFFLINE
      </span>
    </div>
  );
}
