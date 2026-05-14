import Link from "next/link";
import Image from "next/image";
import ScrollReveal from "@/components/ui/ScrollReveal";

const LOGOS = [
  { src: "/images/AiConnect.png", alt: "AI Connect" },
  { src: "/images/DTETI.png", alt: "DTETI UGM" },
  { src: "/images/ugm.png", alt: "Universitas Gadjah Mada" },
  { src: "/images/FINDIT.png", alt: "FINDIT" },
];

export default function HomePage() {
  return (
    <div className="w-full overflow-x-hidden" style={{ backgroundColor: "var(--bg-canvas)", color: "var(--text-primary)" }}>

      {/* ── SECTION 1: Logo full screen ── */}
      <section
        className="flex flex-col items-center justify-center text-center px-12"
        style={{ minHeight: "calc(100vh - 42px)", backgroundColor: "var(--bg-canvas)" }}
      >
        <ScrollReveal direction="up">
          <Image
            src="/images/CkckLogo.png"
            alt="CkCk"
            width={280}
            height={100}
            className="object-contain mx-auto mb-6"
            priority
          />
          <p className="text-xs uppercase tracking-[0.3em] font-sora" style={{ color: "var(--text-muted)" }}>
            Deteksi Hoaks · Jaga Privasi
          </p>
        </ScrollReveal>
      </section>

      {/* ── SECTION 2: Hero ── */}
      <section
        className="min-h-screen flex flex-col items-center justify-center text-center px-8 md:px-24"
        style={{ backgroundColor: "var(--bg-canvas)" }}
      >
        <div className="max-w-3xl">
          <ScrollReveal direction="left">
            <h1
              className="font-sora font-extrabold leading-tight mb-6"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", color: "var(--text-primary)" }}
            >
              Deteksi Hoaks<br />
              <span style={{ color: "var(--text-slogan)" }}>Sepenuhnya Offline</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal direction="right" delay={150}>
            <p
              className="font-sora font-light mb-10"
              style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)", color: "var(--text-muted)", lineHeight: 1.6 }}
            >
              AI yang berjalan 100% lokal di perangkat Anda. Analisis konten
              sebelum dibagikan. Privasi selalu terjaga.
            </p>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={300}>
            <Link
              href="/analyzer"
              className="inline-block font-sora font-bold text-sm uppercase tracking-widest px-10 py-4 transition-opacity hover:opacity-80"
              style={{ backgroundColor: "var(--accent-primary)", color: "var(--bg-canvas)", borderRadius: "4px" }}
            >
              Mulai Analisis →
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ── SECTION 3: Masalah ── */}
      <section
        className="min-h-screen flex flex-col items-center justify-center px-8 md:px-24 py-24"
        style={{ backgroundColor: "var(--bg-main)", borderTop: "1px solid var(--border-main)" }}
      >
        <div className="max-w-2xl w-full">
          <ScrollReveal direction="left">
            <h2
              className="font-sora font-extrabold mb-12"
              style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "var(--text-primary)" }}
            >
              Masalah yang Kami Selesaikan
            </h2>
          </ScrollReveal>
          <div className="flex flex-col gap-10">
            <ScrollReveal direction="right" delay={0}>
              <h3 className="font-sora font-bold text-base mb-2" style={{ color: "var(--text-slogan)" }}>
                📱 Konten Manipulatif Tersebar dengan Cepat
              </h3>
              <p className="font-sora text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                Setiap hari, jutaan orang di Indonesia membagikan konten palsu tanpa memikirkan dampaknya.
                Hoaks, deepfake, dan pesan menakut-nakuti tersebar sebelum ada verifikasi.
              </p>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={120}>
              <h3 className="font-sora font-bold text-base mb-2" style={{ color: "var(--text-slogan)" }}>
                🔒 Privasi Data Anda Tidak Terlindungi
              </h3>
              <p className="font-sora text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                Layanan online mengirim setiap konten ke server mereka. Data pribadi Anda bisa tersimpan,
                dijual, atau disalahgunakan.
              </p>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={240}>
              <h3 className="font-sora font-bold text-base mb-2" style={{ color: "var(--text-slogan)" }}>
                ⚡ CkCk: Solusi Offline &amp; Pribadi
              </h3>
              <p className="font-sora text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                CkCk berjalan 100% di perangkat Anda. Tidak ada koneksi internet. Tidak ada data yang
                meninggalkan perangkat. Analisis instan dengan AI khusus Bahasa Indonesia.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: Cara Kerja ── */}
      <section
        className="min-h-screen flex flex-col items-center justify-center px-8 md:px-24 py-24"
        style={{ backgroundColor: "var(--bg-canvas)" }}
      >
        <div className="max-w-3xl w-full">
          <ScrollReveal direction="up">
            <h2
              className="font-sora font-extrabold mb-12 text-center"
              style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "var(--text-primary)" }}
            >
              Cara Kerja CkCk
            </h2>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <ScrollReveal direction="left">
              <h3 className="font-sora font-bold text-sm uppercase tracking-widest mb-6" style={{ color: "var(--text-slogan)" }}>
                Pipeline Analisis 4 Tahap
              </h3>
              <ol className="flex flex-col gap-5">
                {[
                  ["PII Filter", "Hapus data pribadi sebelum AI menyentuh konten"],
                  ["IndoBERT Classifier", "Model 110M parameter khusus Bahasa Indonesia"],
                  ["Rule-Based Detector", "Identifikasi pola manipulatif (urgency, CAPSLOCK, dll)"],
                  ["Output Engine", "Berikan hasil dengan penjelasan lengkap"],
                ].map(([title, desc], i) => (
                  <li key={i} className="flex gap-3">
                    <span className="font-mono text-xs mt-0.5 shrink-0" style={{ color: "var(--text-muted)" }}>
                      0{i + 1}.
                    </span>
                    <div>
                      <p className="font-sora font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{title}</p>
                      <p className="font-sora text-xs leading-relaxed mt-0.5" style={{ color: "var(--text-muted)" }}>{desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </ScrollReveal>

            <div className="flex flex-col gap-3">
              {[
                { label: "✅ TERVERIFIKASI", sub: "confidence ≥ 75%",          bg: "rgba(0,50,86,0.4)",    border: "#015184", text: "#9BCBFF",  delay: 0   },
                { label: "🔴 WASPADAI",       sub: "hoaks + pola manipulatif", bg: "rgba(61,13,10,0.6)",   border: "#C8352A", text: "#FFDAD6",  delay: 120 },
                { label: "⚠️ KONTEKS BERBEDA", sub: "50–75% confidence",       bg: "rgba(67,44,0,0.5)",    border: "#5F3F00", text: "#FFC66B",  delay: 240 },
                { label: "❓ NETRAL",          sub: "sinyal rendah",            bg: "rgba(58,52,43,0.4)",   border: "#3A342B", text: "#9D8E7C",  delay: 360 },
              ].map(({ label, sub, bg, border, text, delay }) => (
                <ScrollReveal key={label} direction="up" delay={delay}>
                  <div
                    className="font-mono text-xs px-4 py-3 rounded"
                    style={{ backgroundColor: bg, border: `1px solid ${border}`, color: text }}
                  >
                    <span className="font-bold">{label}</span>
                    <span className="ml-2 opacity-70">— {sub}</span>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: CTA ── */}
      <section
        className="flex flex-col items-center justify-center text-center px-8 py-32"
        style={{ backgroundColor: "var(--bg-main)", borderTop: "1px solid var(--border-main)" }}
      >
        <ScrollReveal direction="left">
          <h2
            className="font-sora font-extrabold mb-6"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "var(--text-primary)" }}
          >
            Siap Validasi Semua Informasi?
          </h2>
        </ScrollReveal>
        <ScrollReveal direction="right" delay={150}>
          <p
            className="font-sora text-sm mb-10 max-w-md leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            Mulai analisis konten sekarang. Semua pemrosesan terjadi di perangkat Anda,
            tanpa internet, tanpa jejak.
          </p>
        </ScrollReveal>
        <ScrollReveal direction="up" delay={300}>
          <Link
            href="/analyzer"
            className="inline-block font-sora font-bold text-sm uppercase tracking-widest px-10 py-4 transition-opacity hover:opacity-80"
            style={{ backgroundColor: "var(--accent-primary)", color: "var(--bg-canvas)", borderRadius: "4px" }}
          >
            Mulai Sekarang →
          </Link>
        </ScrollReveal>

        {/* Collaborator logos */}
        <ScrollReveal direction="up" delay={450} className="mt-20 flex flex-col items-center gap-4">
          <p className="text-[10px] uppercase tracking-widest font-sora" style={{ color: "var(--text-dimmer)" }}>
            Berkolaborasi dengan
          </p>
          <div className="flex items-center gap-6">
            {LOGOS.map((logo) => (
              <Image
                key={logo.alt}
                src={logo.src}
                alt={logo.alt}
                height={16}
                width={56}
                className="h-4 w-auto object-contain opacity-40 hover:opacity-80 grayscale hover:grayscale-0 transition-all"
              />
            ))}
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
