import { App, Notice, TFile } from "obsidian";
import { getDB } from "src/db";
import { Cluster, NoteData } from "src/types/types";
import { generateClusterMetadata } from "src/templates/generateClusterMetadata";

export async function generateNoteClusters(app: App, threshold = 0.25): Promise<Cluster[]> {
  new Notice("🔍 Clustering notes from Luma database...");

  const db = getDB();
  const rawNotes = db.data?.notes || [];

  const notes: NoteData[] = rawNotes.map(row => ({
    file: { path: row.path } as TFile,
    content: row.content,
    vector: row.embedding
  }));

  const clusters: Cluster[] = [];

  for (const note of notes) {
    let matched = false;
    for (const cluster of clusters) {
      const sims = cluster.notes.map(n => cosineSim(n.vector, note.vector));
      const avgSim = sims.reduce((a, b) => a + b, 0) / sims.length;
      if (avgSim >= threshold) {
        cluster.notes.push(note);
        matched = true;
        break;
      }
    }

    if (!matched) {
      clusters.push({
        title: "Untitled",
        description: "Pending metadata generation...",
        notes: [note]
      });
    }
  }

  // Add titles + descriptions to each cluster
  for (const cluster of clusters) {
    const meta = await generateClusterMetadata(app, cluster.notes);
    cluster.title = meta.title;
    cluster.description = meta.description;
  }

  new Notice(`✅ Clustered ${notes.length} notes into ${clusters.length} clusters.`);
  return clusters;
}


function cosineSim(vecA: number[], vecB: number[]): number {
  const dot = vecA.reduce((acc, v, i) => acc + v * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((acc, v) => acc + v * v, 0));
  const normB = Math.sqrt(vecB.reduce((acc, v) => acc + v * v, 0));
  return dot / (normA * normB);
}