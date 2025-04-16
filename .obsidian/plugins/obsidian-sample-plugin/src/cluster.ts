import { Cluster, NoteData } from "types/types";

export function clusterNotes(notes: NoteData[], threshold = 0.85): Cluster[] {
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
      clusters.push({ notes: [note] });
    }
  }

  return clusters;
}

export function cosineSim(vecA: number[], vecB: number[]): number {
  const dot = vecA.reduce((acc, v, i) => acc + v * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((acc, v) => acc + v * v, 0));
  const normB = Math.sqrt(vecB.reduce((acc, v) => acc + v * v, 0));
  return dot / (normA * normB);
}