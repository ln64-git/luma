import { TFile, App, } from 'obsidian';

export function getTemplate(app: App, templateName: string): TFile | null {
  const vault = app.vault;
  const files = vault.getMarkdownFiles()
    .filter((file: TFile) => file.path.startsWith('Resources/Templates/') && file.name === templateName);
  if (files.length === 0) {
    console.log(`Template ${templateName} not found in Ressources/Templates.`);
    return null;
  }
  return files[0];
}

export function getNotesFromFolder(app: App, folderPath: string): TFile[] {
  const vault = app.vault;
  const files = vault.getMarkdownFiles()
    .filter((file: TFile) => file.path.startsWith(folderPath + '/'))
    .sort((a: TFile, b: TFile) => a.name.localeCompare(b.name));
  if (files.length === 0) {
    console.log(`No notes found in ${folderPath}`);
  }
  return files;
}

export function formattedNote(app: App, content: string, templatePath: string): boolean {
  const vault = app.vault;
  const template = vault.getMarkdownFiles()
    .filter((file: TFile) => file.path === templatePath);
  if (template.length === 0) {
    console.log(`Template ${templatePath} not found.`);
    return false;
  }
  return content.includes(template[0].basename);
}