export type InferenceStatus =
  | "TERVERIFIKASI"
  | "KONTEKS_BERBEDA"
  | "WASPADAI"
  | "NETRAL";

export interface InferenceResult {
  status: InferenceStatus;
  confidence_hoax: number;
  confidence_valid: number;
  penjelasan: string;
  pola_terdeteksi: string[];
  pii_disensor: boolean;
  teks_yang_dianalisis?: string;
  sumber_teks: string[];
  metadata_media: Record<string, unknown>;
}

export interface SessionEntry {
  id: string;
  timestamp: string;
  input_preview: string;
  input_type: string;
  status: InferenceStatus;
  confidence_hoax: number;
  penjelasan: string;
  pola_terdeteksi: string[];
}

export interface SystemStatus {
  model_loaded: boolean;
  model_size_mb: number;
  device: string;
  backend_url: string;
  total_analisis_sesi: number;
  avg_inference_ms: number;
  offline: boolean;
}

export type PipelineStage =
  | "upload_received"
  | "pii_filter"
  | "indobert"
  | "rule_based"
  | "output"
  | "complete";

export interface SSEEvent {
  stage: PipelineStage | "error";
  status?: string;
  filename?: string;
  result?: InferenceResult;
  total_ms?: number;
  message?: string;
}

export interface StageInfo {
  name: string;
  key: PipelineStage;
  status: "pending" | "running" | "complete";
  timeMs?: number;
}
