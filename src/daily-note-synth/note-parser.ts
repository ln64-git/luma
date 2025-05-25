import { pipeline, Tensor } from '@xenova/transformers';

// Flexible segmentation of natural human notes
function segmentLooseText(text: string): string[] {
  const roughSegments = text.split(/\n{2,}|(?<=[.!?])\s+(?=[A-Z])|(?<=\w{3,})\n+/g);
  return roughSegments
    .map(s => s.trim())
    .filter(s => s.length > 0 && s.length <= 500);
}

export async function parseNoteEntities(text: string, threshold: number) {
  // Step 1: Segment loosely
  const segments = segmentLooseText(text);

  // Step 2: Embed
  const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  const embeddings: Tensor[] = await Promise.all(segments.map(s => embedder(s)));

  // Step 3: Cluster by cosine sim
  const clusters: number[][] = [];
  const assigned = new Array(segments.length).fill(false);

  for (let i = 0; i < segments.length; i++) {
    if (assigned[i]) continue;
    const cluster = [i];
    assigned[i] = true;

    const embI = (embeddings[i] as Tensor).data as number[];

    for (let j = i + 1; j < segments.length; j++) {
      if (assigned[j]) continue;
      const embJ = (embeddings[j] as Tensor).data as number[];
      const sim = cosineSimilarity(embI, embJ);
      if (sim >= threshold) {
        cluster.push(j);
        assigned[j] = true;
      }
    }
    clusters.push(cluster);
  }

  // Step 4: Output
  clusters.forEach((cluster, idx) => {
    console.log(`\n--- Cluster ${idx + 1} ---`);
    cluster.forEach(i => console.log(segments[i]));
  });
}

// utils.ts
export function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const magB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  return dot / (magA * magB);
}
