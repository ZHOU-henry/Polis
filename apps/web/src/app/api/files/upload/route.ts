import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const uploadRoot = path.resolve(process.cwd(), "..", "..", "storage", "uploads");
const maxFileSizeBytes = 50 * 1024 * 1024;

function sanitizeExtension(filename: string) {
  const ext = path.extname(filename).slice(0, 32);
  return ext.replace(/[^a-zA-Z0-9._-]/g, "");
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const files = formData.getAll("files").filter((item): item is File => item instanceof File);

  if (files.length === 0) {
    return NextResponse.json(
      { error: "No files were provided." },
      { status: 400 }
    );
  }

  await mkdir(uploadRoot, { recursive: true });

  const items = [] as Array<{
    id: string;
    originalName: string;
    storedName: string;
    contentType: string;
    size: number;
  }>;

  for (const file of files) {
    if (file.size > maxFileSizeBytes) {
      return NextResponse.json(
        { error: `File ${file.name} exceeds the 50MB limit.` },
        { status: 400 }
      );
    }

    const id = randomUUID();
    const storedName = `${id}${sanitizeExtension(file.name)}`;
    const filePath = path.join(uploadRoot, storedName);
    const metaPath = path.join(uploadRoot, `${storedName}.json`);
    const buffer = Buffer.from(await file.arrayBuffer());
    const contentType = file.type || "application/octet-stream";

    await writeFile(filePath, buffer);
    await writeFile(
      metaPath,
      JSON.stringify(
        {
          id,
          originalName: file.name,
          storedName,
          contentType,
          size: file.size
        },
        null,
        2
      ),
      "utf8"
    );

    items.push({
      id,
      originalName: file.name,
      storedName,
      contentType,
      size: file.size
    });
  }

  return NextResponse.json({ items });
}
