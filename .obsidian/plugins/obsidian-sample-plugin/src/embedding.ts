import { Cluster, NoteData } from "types/types";
import { OllamaEmbeddings } from "@langchain/ollama";

export async function getEmbedding(text: string, model = "nomic-embed-text"): Promise<number[]> {
  const embedder = new OllamaEmbeddings({
    model,
  });
  const [embedding] = await embedder.embedDocuments([text]); // returns a list
  return embedding;
}


