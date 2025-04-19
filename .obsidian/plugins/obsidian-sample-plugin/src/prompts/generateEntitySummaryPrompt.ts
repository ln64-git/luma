export function generateEntitySummaryPrompt(label: string, combinedText: string): string {
  return `
You are a symbolic dream interpreter.

You will be given a group of dreams that may contain 1–3 recurring entities, themes, or symbolic figures. Your job is to identify each one separately.

For each, return:
- "entity": short symbolic label
- "summary": its role or emotional tone
- "interpretation": what this symbol represents psychologically
- "quote": a key quote or moment that reflects it
- "connections": related symbolic or emotional concepts (1–3)

Output a JSON array in triple backticks like this:

\`\`\`json
[
  {
    "entity": "example",
    "summary": "...",
    "interpretation": "...",
    "quote": "A relevant quote.",
    "connections": ["...", "..."]
  }
]
\`\`\`

Respond ONLY with JSON. No explanations.

Dreams to analyze:
${combinedText}
`.trim();
}
