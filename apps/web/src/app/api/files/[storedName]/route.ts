import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const uploadRoot = path.resolve(process.cwd(), "..", "..", "storage", "uploads");

export async function GET(
  _request: Request,
  context: { params: Promise<{ storedName: string }> }
) {
  const { storedName } = await context.params;

  if (!storedName || storedName.includes("/") || storedName.includes("..")) {
    return NextResponse.json({ error: "Invalid file path." }, { status: 400 });
  }

  const filePath = path.join(uploadRoot, storedName);
  const metaPath = path.join(uploadRoot, `${storedName}.json`);

  try {
    const [fileBuffer, metaBuffer] = await Promise.all([
      readFile(filePath),
      readFile(metaPath, "utf8")
    ]);
    const meta = JSON.parse(metaBuffer) as {
      originalName?: string;
      contentType?: string;
    };

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": meta.contentType || "application/octet-stream",
        "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(
          meta.originalName || storedName
        )}`,
        "Cache-Control": "private, max-age=0, must-revalidate"
      }
    });
  } catch {
    return NextResponse.json({ error: "File not found." }, { status: 404 });
  }
}
