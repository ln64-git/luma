import { Notice } from "obsidian";
import callOllama from "src/lib/langchain";

const options = {
  prompt: "what is this?",
};

export async function synthesizeDailyNote(content: string): Promise<string> {
  const response = await callOllama(content, options);
  if (!response.text) {
    console.error("Error in synthesis: No text returned");
  } else {
    new Notice("Synthesis failed!");
  }

  return response.text
}