import { App } from "obsidian";
import { NoteData } from "src/types/types";
import callOllama from "src/utility/langchain";
import { extractJson } from "src/utility/utility";

export async function generateClusterMetadata(app: App, cluster: NoteData[]): Promise<{ title: string, description: string }> {
  const text = cluster.map(n => n.content).join("\n---\n").slice(0, 8000); // Keep token size safe
  const prompt = `
You are a poetic AI librarian. Summarize the theme of the following collection of notes.

Return a JSON object with:
- "title": a short, symbolic name (1–3 words)
- "description": a 1–2 sentence abstract that describes the theme or insight of this cluster.

Respond only in this JSON format:
{
  "title": "...",
  "description": "..."
}

Here are the notes:
\`\`\`
${text}
\`\`\`
`;

  const response = await callOllama(app, prompt, {
    model: "gemma3",
    temperature: 0.6,
    systemPrompt: "You are a symbolic clustering summarizer",
  });

  const json = extractJson(response.toString());
  return JSON.parse(json);
}