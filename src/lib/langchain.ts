import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatOllama } from "@langchain/ollama";

interface CallOllamaOptions {
  systemPrompt?: string;
  model?: string;
  temperature?: number;
  maxRetries?: number;
}

export default async function callOllama(
  inputText: string,
  options: CallOllamaOptions = {}
) {
  const {
    systemPrompt = "You are a helpful assistant.",
    model = "llama3",
    temperature = 0.7,
    maxRetries = 2,
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

  return await chat.invoke(messages);
}
