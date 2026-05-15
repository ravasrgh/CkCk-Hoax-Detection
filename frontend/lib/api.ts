import type {
  SSEEvent,
  InferenceResult,
  SystemStatus,
  SessionEntry,
} from "./types";

const BASE = "http://localhost:8000";

export async function streamAnalysis(
  formData: FormData,
  onStage: (event: SSEEvent) => void,
  onComplete: (result: InferenceResult, totalMs: number) => void,
  onError: (err: string) => void
): Promise<void> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30_000);

  try {
    const response = await fetch(`${BASE}/analyze/stream`, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });

    if (!response.ok) {
      onError(`Server error: ${response.status}`);
      return;
    }

    const reader = response.body?.getReader();
    if (!reader) {
      onError("Tidak dapat membaca respons streaming.");
      return;
    }

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data: ")) continue;

        try {
          const event: SSEEvent = JSON.parse(trimmed.slice(6));

          if (event.stage === "error") {
            onError(event.message || "Terjadi kesalahan.");
            return;
          }

          onStage(event);

          if (event.stage === "complete" && event.result && event.total_ms !== undefined) {
            onComplete(event.result, event.total_ms);
          }
        } catch {
          // skip malformed JSON lines
        }
      }
    }
  } catch (e) {
    if (e instanceof Error && e.name === "AbortError") {
      onError("Analisis memakan waktu terlalu lama. Coba lagi.");
    } else {
      onError("Model AI belum siap. Pastikan backend sudah berjalan.");
    }
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function getStatus(): Promise<SystemStatus> {
  const res = await fetch(`${BASE}/status`);
  if (!res.ok) throw new Error(`Status error: ${res.status}`);
  return res.json();
}

export async function getHistory(): Promise<SessionEntry[]> {
  const res = await fetch(`${BASE}/history`);
  if (!res.ok) throw new Error(`History error: ${res.status}`);
  return res.json();
}

export async function clearHistory(): Promise<void> {
  const res = await fetch(`${BASE}/history`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Clear history error: ${res.status}`);
}

export async function getHistoryEntry(id: string): Promise<InferenceResult> {
  const res = await fetch(`${BASE}/history/${id}`);
  if (!res.ok) throw new Error(`History entry error: ${res.status}`);
  return res.json();
}

export async function injectConfig(
  updates: Record<string, unknown>
): Promise<{ status: string; active_config: Record<string, unknown> }> {
  const res = await fetch(`${BASE}/inject`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ updates }),
  });
  if (!res.ok) throw new Error(`Inject error: ${res.status}`);
  return res.json();
}

export async function getCurrentConfig(): Promise<Record<string, unknown>> {
  const res = await fetch(`${BASE}/inject/current`);
  if (!res.ok) throw new Error(`Config error: ${res.status}`);
  return res.json();
}
