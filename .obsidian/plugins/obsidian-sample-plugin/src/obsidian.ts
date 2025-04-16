import { App, Notice } from "obsidian";

export async function getObsidianNotes(app: App): Promise<string[]> {
  const files = app.vault
    .getMarkdownFiles()
    .filter(file => !file.path.startsWith("Luma/"));
  if (files.length === 0) {
    new Notice("No markdown files found.");
    return [];
  }
  const fileContents = await Promise.all(
    files.map(file => app.vault.read(file))
  );
  return fileContents;
}
