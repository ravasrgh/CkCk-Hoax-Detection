"use client";

import { useEffect, useState, useRef, useCallback } from "react";

const ACCEPTED_TYPES =
  "image/*,video/*,audio/*,.jpg,.jpeg,.png,.webp,.mp4,.webm,.mov,.avi,.mp3,.wav,.ogg,.m4a";
const MAX_SIZE = 50 * 1024 * 1024;
const ALLOWED_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "webp",
  "mp4",
  "webm",
  "mov",
  "avi",
  "mp3",
  "wav",
  "ogg",
  "m4a",
]);

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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState(initialCaption);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const clearSelectedFile = useCallback(() => {
    setFile(null);
    setPreviewUrl(null);
    onFileChange?.(null);
    if (inputRef.current) inputRef.current.value = "";
  }, [onFileChange]);

  const getExtension = (name: string) => {
    const parts = name.split(".");
    return parts.length > 1 ? parts.pop()?.toLowerCase() ?? "" : "";
  };

  const getMediaType = (f: File) => {
    const ext = getExtension(f.name);

    if (f.type.startsWith("image/") || ["jpg", "jpeg", "png", "webp"].includes(ext)) {
      return "GAMBAR";
    }
    if (f.type.startsWith("video/") || ["mp4", "webm", "mov", "avi"].includes(ext)) {
      return "VIDEO";
    }
    if (f.type.startsWith("audio/") || ["mp3", "wav", "ogg", "m4a"].includes(ext)) {
      return "AUDIO";
    }
    return null;
  };

  const openFilePicker = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleFile = useCallback(
    (f: File) => {
      setError("");
      const ext = getExtension(f.name);

      if (!ALLOWED_EXTENSIONS.has(ext)) {
        setError("Format file tidak didukung. Gunakan JPG, PNG, WEBP, MP4, MOV, AVI, MP3, WAV, OGG, atau M4A.");
        clearSelectedFile();
        return;
      }

      if (f.size > MAX_SIZE) {
        setError("Ukuran file melebihi batas 50MB.");
        clearSelectedFile();
        return;
      }

      setFile(f);
      onFileChange?.(f);

      if (previewUrl) URL.revokeObjectURL(previewUrl);

      if (getMediaType(f) !== "AUDIO") {
        setPreviewUrl(URL.createObjectURL(f));
      } else {
        setPreviewUrl(null);
      }
    },
    [clearSelectedFile, onFileChange, previewUrl]
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

  const mediaType = file ? getMediaType(file) : null;

  return (
    <div className="space-y-4">
      <div
        role="button"
        tabIndex={0}
        className={`block border-2 border-dashed p-8 cursor-pointer transition-all duration-200 ${
          dragOver
            ? "border-[#E8A838] bg-[#E8A838]/5"
            : "border-[#3A342B] hover:border-[#504535] bg-[#0A0704]"
        }`}
        onClick={openFilePicker}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openFilePicker();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES}
          className="sr-only"
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />

        {file ? (
          <div className="space-y-3 text-center">
            {previewUrl && mediaType === "GAMBAR" && (
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-48 mx-auto border border-[#2C2820]"
              />
            )}
            {previewUrl && mediaType === "VIDEO" && (
              <video
                src={previewUrl}
                controls
                className="max-h-48 w-full border border-[#2C2820]"
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
                clearSelectedFile();
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
      </div>

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
