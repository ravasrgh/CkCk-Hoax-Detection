"use client";

import { STATUS_STYLES } from "@/lib/statusStyles";
import type { InferenceStatus } from "@/lib/types";

const AKSI_CEPAT_MAP: Record<string, string> = {
  WASPADAI:
    "Jangan sebarkan pesan ini. Peringatkan pengirim bahwa konten ini kemungkinan besar adalah hoaks atau manipulasi. Cari informasi dari sumber terpercaya sebelum mempercayainya.",
  KONTEKS_BERBEDA:
    "Verifikasi konteks asli konten ini sebelum membagikannya. Fakta mungkin benar tetapi disajikan dengan framing yang menyesatkan.",
  TERVERIFIKASI:
    "Konten ini tampak valid berdasarkan analisis. Tetap kritis dan periksa sumber asli untuk konfirmasi penuh.",
  NETRAL:
    "Konten ini tidak menunjukkan sinyal manipulatif yang kuat. Tidak ada tindakan mendesak yang diperlukan.",
};

export default function AksiCepat({ status }: { status: InferenceStatus }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.NETRAL;
  const aksi = AKSI_CEPAT_MAP[status] || AKSI_CEPAT_MAP.NETRAL;

  return (
    <div
      className="border-l-4 p-4"
      style={{
        borderLeftColor: style.border,
        backgroundColor: "#120D07",
        borderTop: "1px solid #2C2820",
        borderRight: "1px solid #2C2820",
        borderBottom: "1px solid #2C2820",
      }}
    >
      <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#9A9080] mb-2 font-sora">
        AKSI CEPAT
      </p>
      <p className="text-[#D5C4AF] text-sm leading-relaxed font-sora">
        {aksi}
      </p>
    </div>
  );
}
