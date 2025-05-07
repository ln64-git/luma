import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatOllama } from "@langchain/ollama";

// Default configuration constants
const DEFAULT_SYSTEM_PROMPT = "You are a call and response assistant.";
const DEFAULT_MODEL = "gemma3";
const DEFAULT_TEMPERATURE = 0.7;
const DEFAULT_MAX_RETRIES = 5;
const DEFAULT_NUM_PREDICT = 16;

interface CallOllamaOptions {
  prompt?: string;
  model?: string;
  temperature?: number;
  maxRetries?: number;
  numPredict?: number;
}

export default async function callOllama(
  inputText: string,
  options: CallOllamaOptions = {}
) {
  const {
    prompt = DEFAULT_SYSTEM_PROMPT,
    model = DEFAULT_MODEL,
    temperature = DEFAULT_TEMPERATURE,
    maxRetries = DEFAULT_MAX_RETRIES,
    numPredict = DEFAULT_NUM_PREDICT,
  } = options;

  const chat = new ChatOllama({
    model,
    temperature,
    maxRetries,
    numPredict,
  });

  const messages = [
    new SystemMessage(prompt),
    new HumanMessage(inputText),
  ];

  return chat.invoke(messages);
}
