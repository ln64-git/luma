import { Notice } from "obsidian";
import callOllama from "src/lib/langchain";
import { SYSTEM_PROMPT_ORGANIZER } from "./format-note";

export async function synthesizeDailyNote(content: string): Promise<string> {
  new Notice("Synthesizing daily note...");

  const systemPrompt = SYSTEM_PROMPT_ORGANIZER;

  const response = await callOllama(content, {
    prompt: systemPrompt,
  });

  if (!response.text) {
    console.error("Error in synthesis: No text returned");
    new Notice("Synthesis failed!");
    return content; // fallback to raw
  }

  return response.text;
}
