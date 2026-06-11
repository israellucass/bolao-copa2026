import { readFile } from "node:fs/promises";
import { join } from "node:path";

export async function getMascotDataUrl(): Promise<string> {
  const buffer = await readFile(
    join(process.cwd(), "public/grileiros-mascot.png")
  );
  return `data:image/png;base64,${buffer.toString("base64")}`;
}
