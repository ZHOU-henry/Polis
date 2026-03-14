import type { UploadedArtifact } from "@agora/shared/domain";

export async function uploadSelectedFiles(files: FileList | File[]) {
  const entries = Array.from(files);

  if (entries.length === 0) {
    return [] as UploadedArtifact[];
  }

  const formData = new FormData();

  for (const file of entries) {
    formData.append("files", file);
  }

  const response = await fetch("/api/files/upload", {
    method: "POST",
    body: formData
  });

  const payload = (await response.json()) as {
    items?: UploadedArtifact[];
    error?: string;
  };

  if (!response.ok || !payload.items) {
    throw new Error(payload.error ?? "File upload failed.");
  }

  return payload.items;
}

export function formatArtifactSize(size: number, locale: "zh" | "en") {
  if (size >= 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  if (size >= 1024) {
    return `${Math.round(size / 1024)} KB`;
  }

  return locale === "zh" ? `${size} 字节` : `${size} bytes`;
}
