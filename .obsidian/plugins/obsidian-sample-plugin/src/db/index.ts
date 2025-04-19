import { App, TFile, normalizePath } from "obsidian";
import { Low, Adapter } from "lowdb";
import { LumaData } from "src/types/types";

class ObsidianAdapter<T> implements Adapter<T> {
  private app: App;
  private filePath: string;

  constructor(app: App, filePath: string) {
    this.app = app;
    this.filePath = normalizePath(filePath);
  }

  async read(): Promise<T | null> {
    const file = this.app.vault.getAbstractFileByPath(this.filePath);
    if (file && file instanceof TFile) {
      const content = await this.app.vault.read(file);
      try {
        return JSON.parse(content) as T;
      } catch (err) {
        console.warn(`⚠️ Failed to parse JSON from ${this.filePath}:`, err);
        return null;
      }
    }
    return null;
  }

  async write(data: T): Promise<void> {
    const content = JSON.stringify(data, null, 2);
    const file = this.app.vault.getAbstractFileByPath(this.filePath);

    try {
      if (file && file instanceof TFile) {
        await this.app.vault.modify(file, content);
        console.log(`✏️ Updated existing DB file: ${this.filePath}`);
      } else {
        await this.app.vault.create(this.filePath, content);
        console.log(`📄 Created new DB file: ${this.filePath}`);
      }
    } catch (error) {
      console.error(`❌ Failed to write DB file: ${this.filePath}`, error);
    }
  }
}

let db: Low<LumaData>;

export async function initDB(app: App): Promise<void> {
  const adapter = new ObsidianAdapter<LumaData>(app, "Luma/luma_index.json");
  db = new Low(adapter, { notes: [], entities: [] });

  try {
    await db.read();
    db.data ||= { notes: [], entities: [] };
    await db.write();
    console.log("✅ Luma DB initialized.");
  } catch (err) {
    console.error("❌ Failed to initialize Luma DB:", err);
  }
}

export async function persistDB(app: App): Promise<void> {
  if (!db || !db.data) return;

  const filePath = normalizePath("Luma/luma_index.json");
  const data = JSON.stringify(db.data, null, 2);
  const file = app.vault.getAbstractFileByPath(filePath);

  try {
    if (file && file instanceof TFile) {
      await app.vault.modify(file, data);
    } else {
      await app.vault.create(filePath, data);
    }
    console.log("💾 DB persisted to:", filePath);
  } catch (err) {
    console.error("❌ Error persisting DB:", err);
  }
}

export function getDB(): Low<LumaData> {
  if (!db) throw new Error("Database not initialized. Call initDB first.");
  return db;
}
