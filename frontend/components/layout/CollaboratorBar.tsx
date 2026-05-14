import Image from "next/image";

const LOGOS = [
  { src: "/images/AiConnect.png", alt: "AI Connect" },
  { src: "/images/DTETI.png", alt: "DTETI UGM" },
  { src: "/images/ugm.png", alt: "Universitas Gadjah Mada" },
  { src: "/images/FINDIT.png", alt: "FINDIT" },
];

export default function CollaboratorBar() {
  return (
    <div
      className="fixed bottom-0 left-0 md:left-[220px] right-0 z-20 border-t border-[#2C2820] px-4 hidden md:flex items-center"
      style={{ backgroundColor: "#1e1a13", height: "4vh", minHeight: "28px", maxHeight: "40px" }}
    >
      <div className="flex items-center gap-3">
        <span className="text-[#9A9080] text-[10px] font-sora whitespace-nowrap">
          Berkolaborasi dengan:
        </span>
        <div className="flex items-center gap-3">
          {LOGOS.map((logo) => (
            <div key={logo.alt} className="relative h-4 w-auto opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
              <Image
                src={logo.src}
                alt={logo.alt}
                height={16}
                width={56}
                className="h-4 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
