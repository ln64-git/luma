

export function generateEntitySummaryPrompt(label: string, combinedText: string): string {
  return `
You are an expert symbolic dream interpreter.

The following dream entries all involve the recurring symbol or concept "${label}". 
Your job is to synthesize the emotional meaning, recurring themes, and evolution of this entity across these appearances.

Return:
- A 2–3 sentence summary of its symbolic or emotional role
- An interpretation of what this entity may represent
- Up to 3 related symbolic or emotional connections

Return a valid JSON object enclosed in triple backticks, like this:
\`\`\`json
{
  "summary": "...",
  "interpretation": "...",
  "connections": ["...", "..."]
}
\`\`\`

Only output this JSON. Do not explain.

Dream Notes:
${combinedText}
`.trim();
}
