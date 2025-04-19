import { App, Notice, } from "obsidian";
import syncNotesToDatabase from "./utility/note";
import { generateEntities, generateLuna, getEntities } from "./utility/entities";

export async function runLuna(app: App) {
	new Notice("✨ Luma is analyzing your vault...");

	// 1. Sync Vault → Database
	await syncNotesToDatabase(app);
	
	// 2. Generate Living Notes (symbolic entities)
	await generateEntities(app, 0.85);

	// 3. Final output step: canvas, summary, haiku, graph, etc
	await generateLuna(app);

	new Notice("✅ Luma: Vault reflection complete.");
}

