import { pipeline, Tensor } from '@xenova/transformers';

// Adaptive segmentation of natural human notes
function segmentLooseText(text: string): string[] {
  const lines = text.split(/(?<=\n)|(?<=[.!?])\s+(?=[A-Z])/g);
  const segments: string[] = [];
  let buffer = '';

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length === 0) continue;
    if ((buffer + ' ' + trimmed).length > 500) {
      segments.push(buffer.trim());
      buffer = trimmed;
    } else {
      buffer += ' ' + trimmed;
    }
  }
  if (buffer.trim().length > 0) {
    segments.push(buffer.trim());
  }
  return segments;
}

export async function parseNoteEntities(text: string, threshold: number) {
  const segments = segmentLooseText(text);
  const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  const embeddings: Tensor[] = await Promise.all(segments.map(s => embedder(s)));

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

  // Generate topic-like cluster summaries
  const entityClusters = clusters.map((cluster, idx) => {
    const entry = cluster.map(i => segments[i]).join(' ');
    return { cluster: idx + 1, text: entry };
  });

  entityClusters.forEach(c => {
    console.log(`\n--- Entry ${c.cluster} ---`);
    console.log(c.text);
  });

  return entityClusters;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const magB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  return dot / (magA * magB);
}
