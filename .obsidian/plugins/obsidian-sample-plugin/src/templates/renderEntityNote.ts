import { NoteData } from "src/types/types";

export function renderEntityNote(params: {
  label: string; // 🔥 ADD THIS
  summary: string;
  interpretation: string;
  connections: string[];
  notes: NoteData[];
  entity?: string;
}) {
  const {
    summary,
    connections,
    notes,
  } = params;

  const sourceLinks = notes.map(n => `- [[${n.file.path}]]`).join("\n");


  return `
# 🔮 ${params.label} Symbol

**Appears In:**  
${sourceLinks}

---

## 🔍 Overview

> ${summary || "_No summary provided._"}

---

## 🔗 Connections

${(connections?.length ?? 0) > 0
      ? connections.map(c => `- Related to [[${c}]]`).join("\n")
      : "- No connections detected."}

      ---
`.trim();
}
