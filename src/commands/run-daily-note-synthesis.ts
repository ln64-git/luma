import { TFile, App, Notice } from 'obsidian';


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
        if (!formattedNote(content, template?.path ?? '')) {
          // you can process `content` here
        }
      });
  });
}

function formattedNote(content: string, template: string): boolean {
  // If we didn't find any filled fields → still looks like template
  return true;
}


function getTemplate(app: App, templateName: string): TFile | null {
  const vault = app.vault;
  const files = vault.getMarkdownFiles()
    .filter((file: TFile) => file.path.startsWith('Resources/Templates/') && file.name === templateName);
  if (files.length === 0) {
    console.log(`Template ${templateName} not found in Ressources/Templates.`);
    return null;
  }
  return files[0];
}

function getNotesFromFolder(app: App, folderPath: string): TFile[] {
  const vault = app.vault;
  const files = vault.getMarkdownFiles()
    .filter((file: TFile) => file.path.startsWith(folderPath + '/'))
    .sort((a: TFile, b: TFile) => a.name.localeCompare(b.name));
  if (files.length === 0) {
    console.log(`No notes found in ${folderPath}`);
  }
  return files;
}
