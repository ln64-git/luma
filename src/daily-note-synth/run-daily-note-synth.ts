import { TFile, App, Notice } from 'obsidian';
import { formattedNote, getNotesFromFolder, getTemplate } from './utils';
import { synthisizeDatilyNote } from './synthisize-daily-note';

export default function runDailyNoteSynthesis(app: App) {
  new Notice("Daily Note Synthesis is running...");
  const dailyNotes = getNotesFromFolder(app, "Daily Notes");

  if (dailyNotes.length === 0) {
    console.log(`No daily notes found in Daily Notes folder.`);
    return;
  }

  const today = new Date().toISOString().split('T')[0];
  const pastDailyNotes = dailyNotes.filter((file: TFile) => file.name !== `${today}.md`);

  const template = getTemplate(app, "Daily Note Template.md");

  pastDailyNotes.forEach((file: TFile) => {
    app.vault.read(file)
      .then((content: string) => {
        if (!formattedNote(app, content, template?.path ?? '')) {
          const processedContent = synthisizeDatilyNote(content)
          console.log("content: ", processedContent);
        }
      });
  });
}