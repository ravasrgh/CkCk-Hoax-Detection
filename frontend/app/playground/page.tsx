"use client";

import { useRouter } from "next/navigation";
import type { InferenceStatus } from "@/lib/types";

interface Sample {
  text: string;
  label: InferenceStatus;
  title: string;
}

const SAMPLES: Sample[] = [
  {
    title: "Berita Resmi Pemerintah",
    text: "Pemerintah Indonesia mengumumkan kebijakan ekonomi baru untuk mendorong pertumbuhan investasi di sektor teknologi.",
    label: "TERVERIFIKASI",
  },
  {
    title: "Laporan Cuaca BMKG",
    text: "BMKG memprediksi cuaca cerah berawan di wilayah Jakarta dan sekitarnya pada hari Selasa.",
    label: "TERVERIFIKASI",
  },
  {
    title: "Pidato Kenegaraan",
    text: "Presiden menyampaikan pidato kenegaraan di Istana Merdeka pada Senin pagi, membahas program pembangunan nasional.",
    label: "TERVERIFIKASI",
  },
  {
    title: "Berita Olahraga",
    text: "Timnas Indonesia berhasil meraih kemenangan 2-1 atas Malaysia di Piala AFF 2026 setelah pertandingan yang ketat.",
    label: "TERVERIFIKASI",
  },
  {
    title: "Hoaks Vaksin 5G",
    text: "BREAKING!! Vaksin COVID-19 terbukti mengandung microchip 5G!! SEGERA sebarkan sebelum dihapus!! BAHAYA!!",
    label: "WASPADAI",
  },
  {
    title: "Pesan Berantai Penipuan",
    text: "AWAS!! JANGAN SAMPAI TERHAPUS!! Modus penipuan baru!! Transfer ke rekening dan uang anda hilang!! SEBARKAN!!",
    label: "WASPADAI",
  },
  {
    title: "Hoaks Kesehatan",
    text: "VIRAL!! Menurut ahli kesehatan, minum air hangat dengan bawang putih TERBUKTI menyembuhkan semua penyakit!! SEGERA bagikan!!",
    label: "WASPADAI",
  },
  {
    title: "Berita Sensasional",
    text: "GEGER!! Penelitian menunjukkan makanan ini BERBAHAYA!! WAJIB BACA sebelum terlambat!! BAHAYA besar bagi kesehatan!!",
    label: "WASPADAI",
  },
];

const STATUS_STYLES: Record<InferenceStatus, { border: string; text: string; label: string }> = {
  TERVERIFIKASI: { border: "border-l-status-terverifikasi-text", text: "text-status-terverifikasi-text", label: "VALID" },
  WASPADAI: { border: "border-l-status-waspadai-text", text: "text-status-waspadai-text", label: "HOAKS" },
  KONTEKS_BERBEDA: { border: "border-l-status-konteks-text", text: "text-status-konteks-text", label: "KONTEKS" },
  NETRAL: { border: "border-l-status-netral-text", text: "text-status-netral-text", label: "NETRAL" },
};

export default function PlaygroundPage() {
  const router = useRouter();

  const handleTry = (text: string) => {
    router.push(`/analyzer?sample=${encodeURIComponent(text)}`);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-mono text-xs uppercase tracking-widest text-ckck-text-muted mb-1">
        PLAYGROUND
      </h1>
      <p className="text-sm text-ckck-text-muted mb-6">
        Coba contoh konten untuk melihat deteksi hoaks beraksi.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SAMPLES.map((sample, i) => {
          const style = STATUS_STYLES[sample.label];
          return (
            <div
              key={i}
              className={`bg-ckck-card border border-ckck-border border-l-4 ${style.border} rounded-lg p-4 flex flex-col`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-ckck-text-primary">
                  {sample.title}
                </span>
                <span className={`font-mono text-[10px] uppercase tracking-widest ${style.text}`}>
                  {style.label}
                </span>
              </div>
              <p className="text-xs text-ckck-text-muted flex-1 line-clamp-3">
                {sample.text}
              </p>
              <button
                onClick={() => handleTry(sample.text)}
                className="mt-3 text-xs font-mono text-ckck-accent hover:text-ckck-accent/80 text-left"
              >
                Coba Contoh Ini →
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
