"use client";

import { STATUS_STYLES } from "@/lib/statusStyles";
import type { InferenceStatus } from "@/lib/types";

const POLA_MAP: Record<string, { label: string; desc: string }> = {
  urgensi_palsu:       { label: "Urgensi Artifisial",     desc: "Penggunaan kata seperti SEGERA, SEBARKAN, JANGAN TERLAMBAT untuk memicu panik" },
  urgensi_artifisial:  { label: "Urgensi Artifisial",     desc: "Penggunaan kata seperti SEGERA, SEBARKAN, JANGAN TERLAMBAT untuk memicu panik" },
  fear_mongering:      { label: "Fear-Mongering",          desc: "Narasi yang secara sengaja menimbulkan ketakutan tanpa dasar fakta" },
  klaim_tanpa_sumber:  { label: "Klaim Tanpa Sumber",      desc: "Pernyataan faktual tanpa referensi yang dapat diverifikasi" },
  atribusi_invalid:    { label: "Atribusi Tidak Valid",    desc: "Mengutip tokoh publik tanpa bukti pernyataan asli" },
  capslock_emosional:  { label: "CAPSLOCK Emosional",      desc: "Penggunaan huruf kapital berlebihan sebagai indikator sensasionalisme" },
  permintaan_data:     { label: "Permintaan Data Pribadi", desc: "Konten meminta informasi sensitif seperti NIK, rekening, atau telepon" },
};

function getPolaInfo(pola: string): { label: string; desc: string } {
  const key = pola.toLowerCase().replace(/\s+/g, "_");
  return (
    POLA_MAP[key] || {
      label: pola.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      desc: "Pola linguistik yang mencurigakan terdeteksi",
    }
  );
}

interface Props {
  pola: string[];
  status: InferenceStatus;
}

export default function PolaLinguistik({ pola, status }: Props) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.NETRAL;

  // Deduplicate by canonical label
  const uniquePola = Array.from(
    new Map(
      pola.map((p) => {
        const info = getPolaInfo(p);
        return [info.label, info];
      })
    ).values()
  );

  if (uniquePola.length === 0) return null;

  return (
    <div className="border border-[#2C2820] bg-[#1A1712] p-4">
      <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#9A9080] mb-4 font-sora">
        POLA LINGUISTIK
      </p>

      <div className="flex flex-col gap-2">
        {uniquePola.map(({ label, desc }) => (
          <div
            key={label}
            className="flex items-start gap-3 p-3 rounded"
            style={{ backgroundColor: `${style.tagBg}33` }}
          >
            <span
              className="flex-shrink-0 inline-flex items-center px-2.5 h-6 rounded-full text-[11px] font-semibold font-sora whitespace-nowrap"
              style={{ backgroundColor: style.tagBg, color: style.tagText }}
            >
              {label}
            </span>
            <p className="text-[#9A9080] text-[12px] leading-relaxed font-sora pt-0.5">
              {desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
