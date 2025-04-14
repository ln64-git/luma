import { App, Notice, normalizePath } from "obsidian";

export default async function runLuna(app: App) {
  const files = app.vault.getMarkdownFiles();

  if (files.length === 0) {
    new Notice("No markdown files found.");
    return;
  }

  const firstFile = files[1];
  const content = await app.vault.read(firstFile);

  const note = {
    path: firstFile.path,
    name: firstFile.name,
    content
  };

  const json = JSON.stringify(note, null, 2);
  const logPath = normalizePath("logs/luma-log.json");

  await app.vault.adapter.write(logPath, json);

  new Notice(`Logged first note "${firstFile.name}" to ${logPath}`);
}
