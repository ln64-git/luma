import { App, Notice, } from "obsidian";
import syncNotesToDatabase from "./utility/note";
import { generateEntities, generateLuna, getEntities } from "./utility/entities";
import { generateNoteClusters } from "./utility/cluster";

export async function runLuna(app: App) {
	new Notice("✨ Luma is analyzing your vault...");

	// 1. Sync Vault → Database
	await syncNotesToDatabase(app);

	// 2. Generate Living Notes (symbolic entities)
	const clusters = await generateNoteClusters(app, 0.85); // returns Record<string, Cluster[]>
	const clusterLog = clusters.map(cluster => ({
		title: cluster.title,
		description: cluster.description
	}));
	console.log(`🔍 Clusters: ${JSON.stringify(clusterLog, null, 2)}`)
		;
	// 3. Final output step: canvas, summary, haiku, graph, etc
	await generateLuna(app);

	new Notice("✅ Luma: Vault reflection complete.");
}

