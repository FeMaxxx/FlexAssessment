import { promises as fs } from "fs";
import path from "path";

const STATE_PATH = path.join(process.cwd(), "data", "reviewState.json");

export interface ReviewStateFile {
  approved: { [id: string]: boolean };
}

async function ensureFile() {
  try {
    await fs.access(STATE_PATH);
  } catch {
    const initial = { approved: {} } satisfies ReviewStateFile;
    await fs.mkdir(path.dirname(STATE_PATH), { recursive: true });
    await fs.writeFile(STATE_PATH, JSON.stringify(initial, null, 2), "utf8");
  }
}

export async function getApprovedMap(): Promise<Record<string, boolean>> {
  await ensureFile();
  const raw = await fs.readFile(STATE_PATH, "utf8");
  const data = JSON.parse(raw) as ReviewStateFile;
  return data.approved || {};
}

export async function setApproved(id: number | string, value: boolean): Promise<void> {
  await ensureFile();
  const raw = await fs.readFile(STATE_PATH, "utf8");
  const data = JSON.parse(raw) as ReviewStateFile;
  data.approved = data.approved || {};
  data.approved[String(id)] = value;
  await fs.writeFile(STATE_PATH, JSON.stringify(data, null, 2), "utf8");
}
