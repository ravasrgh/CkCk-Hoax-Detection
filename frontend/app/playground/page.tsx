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
    title: "Makam Tumpang TPU Grogol",
    text: "JAKARTA, KOMPAS.com – Keterbatasan lahan membuat Taman Pemakaman Umum (TPU) Grogol Kemanggisan di Jakarta Barat menerapkan sistem makam tumpang. Petugas TPU Grogol, Nunu, mengatakan sistem makam tumpang sudah diberlakukan sejak 2016, bersamaan dengan kebijakan penghentian penambahan lahan makam baru. \"Dari 2016, sudah ditutup untuk lahan baru,\" ujar Nunu, Kamis (23/10/2025), dikutip dari Antara. Awalnya, pihak TPU sempat memanfaatkan area bekas gundukan sampah untuk makam baru. Namun, area itu kini sudah habis digunakan. Menurut Nunu, secara aturan Islam, makam maksimal boleh ditumpang tiga kali, namun keterbatasan lahan memaksa pihak TPU melonggarkan aturan hingga lima jenazah dalam satu petak.",
    label: "TERVERIFIKASI",
  },
  {
    title: "Harga Cabai di Pasar Badung Denpasar",
    text: "DENPASAR, KOMPAS.com – Harga cabai rawit merah di Pasar Badung, Denpasar, Bali, turun pada pekan keempat Oktober 2025. Pedagang Pasar Badung, Komang Sari, menyebutkan harga cabai rawit dijual Rp 45.000 per kilogram, turun dari Rp 68.000 per kilogram dua pekan sebelumnya. \"Cabai dari Jember sudah mulai masuk ke pasar sejak awal pekan ini,\" kata Komang Sari, Selasa (21/10/2025). Harga tomat juga ikut turun ke kisaran Rp 8.000 per kilogram dari sebelumnya Rp 12.000 per kilogram, sementara bawang merah stabil di Rp 35.000 per kilogram.",
    label: "TERVERIFIKASI",
  },
  {
    title: "Panen Udang Vaname Sidoarjo",
    text: "SIDOARJO, KOMPAS.com – Pembudidaya udang vaname di Desa Kalanganyar, Kabupaten Sidoarjo, Jawa Timur, memanen udang hasil tambak pada Oktober 2025. Ketua Kelompok Pembudidaya Ikan Mina Laut, Hendra Wijaya, menyebutkan rata-rata produksi mencapai 18 ton per hektare, lebih tinggi dibanding siklus sebelumnya yang hanya 15 ton per hektare. \"Kualitas benih tahun ini lebih baik dan tidak ada serangan penyakit berarti,\" ujar Hendra, Kamis (23/10/2025). Harga jual udang vaname ukuran 70 ekor per kilogram di tingkat tambak tercatat Rp 52.000 per kilogram.",
    label: "TERVERIFIKASI",
  },
  {
    title: "Rencana Jokowi Turun Gunung Keliling Indonesia demi Menangkan PSI di 2029",
    text: "JAKARTA, KOMPAS.com - Mantan Presiden RI Joko Widodo disebut tengah disiapkan untuk turun langsung mendampingi perjuangan Partai Solidaritas Indonesia (PSI) menuju Pemilu 2029. Ketua DPP PSI Bestari Barus mengungkapkan, Jokowi kini telah menjadi bagian dari PSI dan ditetapkan sebagai patron politik partai berlambang gajah tersebut. \“Pak Jokowi itu di PSI sudah gitu. Nah itu satu, dia akan bersama kami, dan kita sudah menetapkan beliau sebagai patron politik daripada perjuangan PSI ke depan gitu. Hanya tinggal nunggu waktu yang tepat saja, mengingat kesehatan beliau,\” ujar Bestari kepada Kompas.com, Kamis (14/5/2026).",
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
