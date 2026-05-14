"use client";

import { STATUS_STYLES } from "@/lib/statusStyles";
import type { InferenceStatus } from "@/lib/types";

const POLA_MAP: Record<string, { label: string; desc: string }> = {
  urgensi_palsu:       { label: "Urgensi artifisial",      desc: "Penggunaan kata seperti SEGERA, SEBARKAN, JANGAN TERLAMBAT untuk memicu panik" },
  urgensi_artifisial:  { label: "Urgensi artifisial",      desc: "Penggunaan kata seperti SEGERA, SEBARKAN, JANGAN TERLAMBAT untuk memicu panik" },
  fear_mongering:      { label: "Fear-mongering",           desc: "Narasi yang secara sengaja menimbulkan ketakutan tanpa dasar fakta" },
  klaim_tanpa_sumber:  { label: "Klaim tanpa sumber",       desc: "Pernyataan faktual tanpa referensi yang dapat diverifikasi" },
  atribusi_invalid:    { label: "Atribusi tidak valid",     desc: "Mengutip tokoh publik tanpa bukti pernyataan asli" },
  capslock_emosional:  { label: "Bahasa CAPSLOCK emosional", desc: "Penggunaan huruf kapital berlebihan sebagai indikator sensasionalisme" },
  permintaan_data:     { label: "Permintaan data pribadi",  desc: "Konten meminta informasi sensitif seperti NIK, rekening, atau telepon" },
};

function getPolaInfo(pola: string): { label: string; desc: string } {
  const key = pola.toLowerCase().replace(/\s+/g, "_");
  return (
    POLA_MAP[key] || {
      label: pola.replace(/_/g, " ").replace(/^\w/, (l) => l.toUpperCase()),
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
      <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#9A9080] mb-3 font-sora">
        POLA LINGUISTIK
      </p>
      <div className="flex flex-wrap gap-2">
        {uniquePola.map(({ label, desc }, index) => (
          <span
            key={label}
            title={desc}
            className="inline-flex items-center px-3 py-1 text-[11px] font-semibold font-sora whitespace-nowrap cursor-default"
            style={{
              backgroundColor: style.tagBg,
              color: style.tagText,
              border: index === 0
                ? `1px solid ${style.border}`
                : "1px solid transparent",
            }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
