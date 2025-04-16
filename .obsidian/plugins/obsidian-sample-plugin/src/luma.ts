import { App, Notice, TFile, normalizePath } from "obsidian";
import callOllama from "./ollama";
import { renderEntityNote } from "./templates/renderEntityNote";
import { generateEntitySummaryPrompt } from "./prompts/generateEntitySummaryPrompt";
import { Cluster } from "types/types";

import { z } from "zod";
import { StructuredOutputParser } from "langchain/output_parsers";
import { clusterNotes } from "./cluster";
import { getObsidianNotes } from "./obsidian";

const LumaEntitySchema = z.array(
	z.object({
		entity: z.string(),
		emotions: z.array(z.string()).optional(),
		summary: z.string().optional(),
		quote: z.string().optional(),
		interpretation: z.string().optional(),
		connections: z.array(z.string()).optional(),
	})
);

const parser = StructuredOutputParser.fromZodSchema(LumaEntitySchema);
const formatInstructions = parser.getFormatInstructions();

export async function runLuna(app: App) {
	new Notice("Luma is analyzing your vault...");

	// syncNotesToDatabase(app);
	// renderDatabaseEmbeddings(app);
	// renderDatabaseClusters(app, 0.85);

	// renderEntities(app);
	// getEntities(app);

	// renderObsidianVault(app);

	const notes = await getObsidianNotes(app)


	const clusters = clusterNotes(notes, 0.85);

	for (let i = 0; i < clusters.length; i++) {
		const cluster = clusters[i];
		const clusterNum = i + 1;

		new Notice(`Luma: Summarizing cluster ${clusterNum}/${clusters.length}...`);

		const combined = cluster.notes.map(n => n.content).join("\n---\n");
		const prompt = `
You are a symbolic dream interpreter.

Your task is to identify 1–2 recurring entities or themes shared across the following notes.

Respond ONLY with a valid JSON array inside triple backticks like this:
\`\`\`json
${formatInstructions}
\`\`\`

Do NOT include any explanation or commentary.

Here are the notes to analyze:
${combined}`;

		try {
			const response = await callOllama(app, prompt.trim(), {
				systemPrompt: "You're an expert dream-symbol and theme interpreter.",
				model: "gemma3",
				temperature: 0.7,
			});

			const json = extractJson(response.toString());
			const parsed = await parser.parse(json);
			const first = parsed?.[0];

			cluster.label = first?.entity || `Cluster-${clusterNum}`;
			cluster.emotions = first?.emotions || [];
			cluster.summary = first?.summary || "";
			cluster.quote = first?.quote || "";
			cluster.interpretation = first?.interpretation || "";
			cluster.connections = first?.connections || [];

		} catch (err) {
			console.error(`❌ Cluster ${clusterNum} failed to parse/validate:`, err);
			cluster.label = `Unlabeled-${clusterNum}`;
			cluster.type = "Unknown";
			cluster.emotions = [];
		}
	}

	new Notice("✅ All clusters summarized.");

	const entityMap: Record<string, Cluster[]> = {};
	for (const cluster of clusters) {
		const label = cluster.label || "unknown";
		if (!entityMap[label]) entityMap[label] = [];
		entityMap[label].push(cluster);
	}

	const folder = normalizePath("Luma/Entities");
	await app.vault.createFolder(folder).catch(() => { });

	for (const label in entityMap) {
		const relatedClusters = entityMap[label];
		const allNotes = relatedClusters.flatMap(c => c.notes);
		const allText = allNotes.map(n => n.content).join("\n---\n");

		const allEmotions = [
			...new Set(relatedClusters.flatMap(c => c.emotions || []))
		];

		const type = relatedClusters[0].type || "symbol";

		const summaryPrompt = generateEntitySummaryPrompt(label, allText);
		const response = await callOllama(app, summaryPrompt, {
			model: "gemma3",
			temperature: 0.7,
			systemPrompt: "You are a symbolic dream summarizer.",
		});

		try {
			const json = extractJson(response.toString());
			const parsed = JSON.parse(json);

			const content = renderEntityNote({
				summary: parsed.summary,
				interpretation: parsed.interpretation,
				connections: parsed.connections,
				emotions: allEmotions,
				notes: allNotes,
			});

			const safeLabel = label
				.toLowerCase()
				.replace(/[^a-z0-9_-]/gi, "_")
				.replace(/_+/g, "_")
				.replace(/^_+|_+$/g, "");

			const filePath = normalizePath(`${folder}/${type} - ${safeLabel}.md`);
			const existing = app.vault.getAbstractFileByPath(filePath);

			if (existing instanceof TFile) {
				await app.vault.modify(existing, content);
				console.log(`✅ Modified: ${filePath}`);
			} else {
				await app.vault.create(filePath, content);
				console.log(`✅ Created: ${filePath}`);
			}
			new Notice(`Luma: Updated entity → ${label}`);
		} catch (err) {
			console.error(`❌ Failed to parse entity summary for ${label}:`, err);
		}
	}
}

function extractJson(raw: string): string {
	const match = raw.match(/```json\s*([\s\S]+?)```/);
	if (!match) throw new Error("No JSON block found in response.");
	return match[1];
}