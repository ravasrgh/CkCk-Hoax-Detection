"use client";

import { useState, useRef, useCallback } from "react";

const ACCEPTED_TYPES = "image/*,video/*,audio/*";
const MAX_SIZE = 50 * 1024 * 1024;

interface Props {
  onSubmit: (formData: FormData) => void;
  initialCaption?: string;
  onFileChange?: (file: File | null) => void;
}

export default function MediaUploader({
  onSubmit,
  initialCaption = "",
  onFileChange,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState(initialCaption);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (f: File) => {
      setError("");
      if (f.size > MAX_SIZE) {
        setError("Ukuran file melebihi batas 50MB.");
        return;
      }
      setFile(f);
      onFileChange?.(f);
      if (f.type.startsWith("image/")) {
        setPreview(URL.createObjectURL(f));
      } else {
        setPreview(null);
      }
    },
    [onFileChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const handleSubmit = () => {
    if (!file && !caption.trim()) return;
    const fd = new FormData();
    if (file) fd.append("file", file);
    fd.append("caption", caption);
    fd.append("input_type", "auto");
    onSubmit(fd);
  };

  const mediaType = file
    ? file.type.startsWith("image/")
      ? "GAMBAR"
      : file.type.startsWith("video/")
      ? "VIDEO"
      : "AUDIO"
    : null;

  return (
    <div className="space-y-4">
      <label
        className={`block border-2 border-dashed p-8 cursor-pointer transition-all duration-200 ${
          dragOver
            ? "border-[#E8A838] bg-[#E8A838]/5"
            : "border-[#3A342B] hover:border-[#504535] bg-[#0A0704]"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />

        {file ? (
          <div className="space-y-3 text-center">
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="max-h-48 mx-auto border border-[#2C2820]"
              />
            )}
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-[#EDE1D4] font-sora truncate max-w-[300px]">
                {file.name}
              </span>
              {mediaType && (
                <span className="px-2 py-0.5 bg-[#241F17] border border-[#2C2820] text-[10px] uppercase tracking-widest text-[#9A9080] font-sora">
                  {mediaType}
                </span>
              )}
            </div>
            <button
              type="button"
              className="text-xs text-[#9A9080] hover:text-[#FFDAD6] font-sora"
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
                setPreview(null);
                onFileChange?.(null);
              }}
            >
              Hapus file
            </button>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-[#9A9080] text-sm font-sora">
              Seret &amp; lepas file, atau klik untuk memilih
            </p>
            <p className="text-[#58524A] text-xs mt-1 font-sora">
              Gambar, Video, Audio — maks 50MB
            </p>
          </div>
        )}
      </label>

      {error && (
        <p className="text-[#FFDAD6] text-sm font-sora">{error}</p>
      )}

      <textarea
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Masukkan teks atau caption untuk dianalisis..."
        className="w-full bg-[#0A0704] border border-[#2C2820] p-3 text-sm text-[#EDE1D4] placeholder:text-[#58524A] focus:border-[#E8A838] focus:outline-none resize-none h-24 font-sora"
      />

      <button
        onClick={handleSubmit}
        disabled={!file && !caption.trim()}
        className="w-full h-[46px] bg-[#E8A838] hover:bg-[#FFC66B] disabled:opacity-40 disabled:cursor-not-allowed text-[#120D07] text-xs font-bold tracking-[0.15em] uppercase transition-colors font-sora"
      >
        ANALISIS →
      </button>
    </div>
  );
}
