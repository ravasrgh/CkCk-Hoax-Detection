import Image from "next/image";

const LOGOS = [
  { src: "/images/AiConnect.png", alt: "AI Connect" },
  { src: "/images/DTETI.png", alt: "DTETI UGM" },
  { src: "/images/ugm.png", alt: "Universitas Gadjah Mada" },
  { src: "/images/FINDIT.png", alt: "FINDIT" },
];

export default function CollaboratorBar() {
  return (
    <div className="border-t border-[#2C2820] bg-[#18130B] px-4 py-3 mb-20 md:mb-0">
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-[#9A9080] text-xs font-sora whitespace-nowrap">
          Berkolaborasi dengan:
        </span>
        <div className="flex items-center gap-4">
          {LOGOS.map((logo) => (
            <div key={logo.alt} className="relative h-6 w-auto opacity-70 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
              <Image
                src={logo.src}
                alt={logo.alt}
                height={24}
                width={80}
                className="h-6 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
