// src/ai/callOllama.ts
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { App } from "obsidian";
import { logToFile } from "./logger";
import { ChatOllama } from "@langchain/ollama";

interface CallOllamaOptions {
  systemPrompt?: string;
  model?: string;
  temperature?: number;
  maxRetries?: number;
  log?: boolean;
}

/**
 * General-purpose call to Ollama chat model with role-based messages.
 */
export default async function callOllama(
  app: App,
  inputText: string,
  options: CallOllamaOptions = {}
) {
  const {
    systemPrompt = "You are a helpful assistant.",
    model = "llama3",
    temperature = 0.7,
    maxRetries = 2,
    log = true,
  } = options;

  const chat = new ChatOllama({
    model,
    temperature,
    maxRetries,
  });

  const messages = [
    new SystemMessage(systemPrompt),
    new HumanMessage(inputText),
  ];

  const response = await chat.invoke(messages);

  if (log) {
    await logToFile(app, {
      systemPrompt,
      input: inputText,
      output: response.content,
      model,
      timestamp: new Date().toISOString(),
    });
  }

  return response.content;
}
