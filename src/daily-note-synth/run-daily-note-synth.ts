import { TFile, App, Notice, } from 'obsidian';
import { getNotesFromFolder, } from './utils';
import { synthesizeDailyNote } from './synthesize-daily-note';

export default function runDailyNoteSynthesis(app: App) {
  const dailyNotes = getNotesFromFolder(app, "Daily Notes");

  if (dailyNotes.length === 0) {
    console.log(`No daily notes found in Daily Notes folder.`);
    return;
  }

  const today = new Date().toLocaleDateString('sv'); // 'sv' locale gives YYYY-MM-DD
  const pastDailyNotes = dailyNotes.filter((file: TFile) => file.name !== `${today}.md`);

  pastDailyNotes.forEach((file: TFile) => {
    app.vault.read(file)
      .then(async (content: string) => {
        const processedContent = await synthesizeDailyNote(content);
        // write to new file 
        const newFileName = `${file.name.replace('.md', '')}-synthesized.md`;
        const newFile = app.vault.getAbstractFileByPath(newFileName);
        if (newFile) {
          console.log(`File ${newFileName} already exists. Skipping.`);
          return;
        }
        await app.vault.create(newFileName, processedContent);
        new Notice(`Synthesized daily note created: ${newFileName}`);
      });
  });
}