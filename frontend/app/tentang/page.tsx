export default function TentangPage() {
  const statuses = [
    { label: "TERVERIFIKASI", desc: "Konten kemungkinan besar akurat dan dapat dipercaya", color: "bg-status-terverifikasi-bg text-status-terverifikasi-text" },
    { label: "KONTEKS BERBEDA", desc: "Konten mungkin benar namun perlu konfirmasi konteks tambahan", color: "bg-status-konteks-bg text-status-konteks-text" },
    { label: "WASPADAI", desc: "Indikasi kuat sebagai konten manipulatif dengan pola spesifik", color: "bg-status-waspadai-bg text-status-waspadai-text" },
    { label: "NETRAL", desc: "Tidak cukup bukti untuk klasifikasi definitif", color: "bg-status-netral-bg text-status-netral-text" },
  ];

  const piiTypes = ["NIK (16-digit)", "Nomor Telepon", "Alamat Email", "Nomor Rekening Bank", "NPWP", "Nomor Paspor"];

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="font-mono text-xs uppercase tracking-widest text-ckck-text-muted">
          TENTANG CKCK
        </h1>
        <p className="text-lg text-ckck-text-primary mt-2">
          Sistem deteksi hoaks berbasis AI yang berjalan 100% offline di perangkat Anda.
        </p>
        <p className="text-sm text-ckck-text-muted mt-2">
          CkCk menganalisis konten berbahasa Indonesia menggunakan model IndoBERT yang telah di-fine-tune
          untuk mendeteksi pola disinformasi dan manipulasi. Semua pemrosesan dilakukan secara lokal —
          tidak ada data yang dikirim ke server eksternal.
        </p>
      </div>

      {/* Pipeline */}
      <div className="bg-ckck-card border border-ckck-border rounded-lg p-6">
        <p className="font-mono text-xs uppercase tracking-widest text-ckck-text-muted mb-4">
          ARSITEKTUR PIPELINE
        </p>
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          {["INPUT", "FILTER PII", "INDOBERT", "RULE-BASED", "HASIL"].map(
            (step, i, arr) => (
              <div key={step} className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded border border-ckck-accent text-ckck-accent">
                  {step}
                </span>
                {i < arr.length - 1 && (
                  <span className="text-ckck-text-muted">→</span>
                )}
              </div>
            )
          )}
        </div>
      </div>

      {/* Classifications */}
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-ckck-text-muted mb-3">
          KLASIFIKASI 4-STATUS
        </p>
        <div className="space-y-2">
          {statuses.map((s) => (
            <div
              key={s.label}
              className={`${s.color} rounded-lg p-4`}
            >
              <p className="font-mono text-sm font-bold">{s.label}</p>
              <p className="text-xs mt-1 opacity-80">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PII */}
      <div className="bg-ckck-card border border-ckck-border rounded-lg p-6">
        <p className="font-mono text-xs uppercase tracking-widest text-ckck-text-muted mb-3">
          JENIS DATA PRIBADI YANG DIPROTEKSI
        </p>
        <div className="flex flex-wrap gap-2">
          {piiTypes.map((t) => (
            <span
              key={t}
              className="px-3 py-1 rounded bg-ckck-border font-mono text-xs text-ckck-text-code"
            >
              🔒 {t}
            </span>
          ))}
        </div>
      </div>

      <p className="text-center text-xs text-ckck-text-muted font-mono">
        FindIT 2026 — Track B: The Privacy Brain (NLP)
      </p>
    </div>
  );
}
