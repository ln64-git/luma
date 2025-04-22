import { App, Notice, normalizePath, TFile, TFolder } from "obsidian";
import callOllama from "../utility/langchain";
import { renderEntityNote } from "../templates/generateEntityNote";
import { generateEntitySummaryPrompt } from "../prompts/generateEntitySummaryPrompt";
import { Cluster } from "../types/types";
import { generateNoteClusters } from "./cluster";

export async function generateEntityNotes(app: App, label: string, clusters: Cluster[]) {
  console.log(`🔍 Generating entity notes for label group: ${label}`);

  const allNotes = clusters.flatMap(c => c.notes);
  const allText = allNotes.map(n => n.content).join("\n---\n");

  const summaryPrompt = generateEntitySummaryPrompt(label, allText);
  const response = await callOllama(app, summaryPrompt, {
    model: "gemma3",
    temperature: 0.7,
    systemPrompt: "You are a symbolic dream summarizer."
  });

  const json = extractJson(response.toString());
  const parsed = JSON.parse(json);

  if (!Array.isArray(parsed)) {
    throw new Error("Expected JSON array of symbolic entities.");
  }

  const results = [];

  for (const entity of parsed) {
    const finalLabel = entity.entity || "Unlabeled";
    const content = renderEntityNote({
      label: entity.label,
      summary: entity.summary,
      interpretation: entity.interpretation,
      connections: entity.connections,
      notes: allNotes
    });

    const safeLabel = finalLabel
      .toLowerCase()
      .replace(/[^a-z0-9_-]/gi, "_")
      .replace(/_+/g, "_")
      .replace(/^_+|_+$/g, "");

    results.push({
      label: finalLabel,
      fileName: `${safeLabel}.md`,
      content
    });
  }

  return results;
}


export async function writeEntityToVault(app: App, label: string, fileName: string, content: string) {
  const folder = normalizePath("Luma/Entities");
  await app.vault.createFolder(folder).catch(() => { });

  const filePath = normalizePath(`${folder}/${fileName}`);
  const existing = app.vault.getAbstractFileByPath(filePath);

  if (existing instanceof TFile) {
    await app.vault.modify(existing, content);
    console.log(`✅ Modified: ${filePath}`);
  } else {
    await app.vault.create(filePath, content);
    console.log(`✅ Created: ${filePath}`);
  }

  new Notice(`Luma: Updated entity → ${label}`);
}

function extractJson(raw: string): string {
  const match = raw.match(/```json\s*([\s\S]+?)```/);
  if (!match) throw new Error("No JSON block found in response.");
  return match[1];
}

export async function generateEntities(app: App, threshold: number = 0.85): Promise<void> {
  const clusters = await generateNoteClusters(app, threshold); // returns Record<string, Cluster[]>

  const clusterLog = clusters.map(cluster => ({
    title: cluster.title,
    description: cluster.description
  }));

  console.log(`🔍 Clusters: ${JSON.stringify(clusterLog, null, 2)}`);


  // for (const label in clusters) {
  //   const result = await generateEntityNotes(app, label, [clusters[label]]);
  //   for (const entity of result) {
  //     await writeEntityToVault(app, entity.label, entity.fileName, entity.content);
  //   }
  //   console.log(`💾 Written entity notes to vault for label: ${label}`);
  // }

  console.log(`✅ Entity generation completed`);
}

export async function getEntities(app: App): Promise<{ label: string; content: string }[]> {
  const folderPath = "Luma/Entities";
  const folder = app.vault.getAbstractFileByPath(folderPath);

  if (!folder || !(folder instanceof TFolder)) {
    throw new Error(`Folder not found or is not a valid folder: ${folderPath}`);
  }

  const result: { label: string; content: string }[] = [];

  for (const file of folder.children) {
    if (file instanceof TFile && file.extension === "md") {
      const content = await app.vault.read(file);
      result.push({ label: file.basename, content });
    }
  }

  return result;
}

export async function generateLuna(app: App): Promise<void> {
  const entities = await getEntities(app);
  const summary = entities
    .map(e => `- **${e.label}**\n${e.content.slice(0, 200)}...`)
    .join("\n\n");

  const finalNote = `# Luma Reflection\n\n${summary}`;
  const filePath = "Luma/Luma Reflection.md";
  const existing = app.vault.getAbstractFileByPath(filePath);

  if (existing instanceof TFile) {
    await app.vault.modify(existing, finalNote);
  } else {
    await app.vault.create(filePath, finalNote);
  }
}
