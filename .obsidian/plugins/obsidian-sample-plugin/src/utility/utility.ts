export function extractJson(raw: string): string {
  const match = raw.match(/```json\s*([\s\S]+?)```/);
  if (!match) throw new Error("No JSON block found in response.");
  return match[1];
}