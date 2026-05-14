"use client";

import { useState, useRef, useCallback } from "react";

const ACCEPTED_TYPES = "image/*,video/*,audio/*";
const MAX_SIZE = 50 * 1024 * 1024;

interface Props {
  onSubmit: (formData: FormData) => void;
  initialCaption?: string;
}

export default function MediaUploader({ onSubmit, initialCaption = "" }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState(initialCaption);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    setError("");
    if (f.size > MAX_SIZE) {
      setError("Ukuran file melebihi batas 50MB.");
      return;
    }
    setFile(f);
    if (f.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(f));
    } else {
      setPreview(null);
    }
  }, []);

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
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
          dragOver
            ? "border-ckck-accent bg-ckck-accent/5"
            : "border-ckck-border hover:border-ckck-text-muted"
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
          <div className="space-y-3">
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="max-h-48 mx-auto rounded border border-ckck-border"
              />
            )}
            <div className="flex items-center justify-center gap-2">
              <span className="font-mono text-sm text-ckck-text-primary truncate max-w-[300px]">
                {file.name}
              </span>
              {mediaType && (
                <span className="px-2 py-0.5 rounded bg-ckck-border font-mono text-[10px] uppercase tracking-widest text-ckck-text-code">
                  {mediaType}
                </span>
              )}
            </div>
            <button
              type="button"
              className="text-xs text-ckck-text-muted hover:text-status-waspadai-text"
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
                setPreview(null);
              }}
            >
              Hapus file
            </button>
          </div>
        ) : (
          <div>
            <p className="text-ckck-text-muted font-mono text-sm">
              Seret & lepas file, atau klik untuk memilih
            </p>
            <p className="text-ckck-text-muted text-xs mt-1">
              Gambar, Video, Audio — maks 50MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-status-waspadai-text text-sm font-mono">{error}</p>
      )}

      <textarea
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Masukkan teks atau caption untuk dianalisis..."
        className="w-full bg-ckck-card border border-ckck-border rounded-lg p-4 text-sm text-ckck-text-primary placeholder-ckck-text-muted resize-none focus:outline-none focus:border-ckck-accent min-h-[100px]"
      />

      <button
        onClick={handleSubmit}
        disabled={!file && !caption.trim()}
        className="w-full py-3 rounded-lg font-mono text-sm uppercase tracking-widest font-bold transition-colors disabled:opacity-30 disabled:cursor-not-allowed bg-ckck-accent text-ckck-bg hover:bg-ckck-accent/90"
      >
        ANALISIS
      </button>
    </div>
  );
}
