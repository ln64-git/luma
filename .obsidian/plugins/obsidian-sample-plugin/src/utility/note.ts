import { getObsidianNotes } from "src/utility/obsidian";
import { upsertNote } from "src/db/notes";
import { App, Notice } from "obsidian";

export default async function syncNotesToDatabase(app: App): Promise<void> {
  const notes = await getObsidianNotes(app);
  let synced = 0;

  for (const note of notes) {
    const path = note.file.path;
  
    // Skip notes that are inside the Luna folder
    if (path.startsWith("Luma/")) {
      continue;
    }
  
    try {
      await upsertNote(note.file.path, note.content);
      synced++;
    } catch (e) {
      console.warn(`❌ Failed to upsert note: ${note.file.path}`, e);
    }
  }
  

  new Notice(`✅ Synced ${synced} notes to index.`);
}
