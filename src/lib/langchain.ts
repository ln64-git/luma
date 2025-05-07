import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatOllama } from "@langchain/ollama";

const SYSTEM_PROMPT_TEMPLATE =
  "You are a call-and-response assistant. Keep replies clear, concise. Your response must be within {{TOKEN_LIMIT}} tokens.";

const DEFAULT_MODEL = "gemma3";
const DEFAULT_TEMPERATURE = 0.7;
const DEFAULT_MAX_RETRIES = 5;
const DEFAULT_NUM_PREDICT = 32;

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
    prompt,
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


  const systemPrompt = SYSTEM_PROMPT_TEMPLATE.replace("{{TOKEN_LIMIT}}", numPredict.toString());
  const fullSystemPrompt = [systemPrompt, prompt].filter(Boolean).join('\n\n');

  const messages = [
    new SystemMessage(fullSystemPrompt),
    new HumanMessage(inputText),
  ];

  return chat.invoke(messages);
}
