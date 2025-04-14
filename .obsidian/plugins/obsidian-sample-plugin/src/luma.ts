import { App, Notice } from "obsidian";
import { logToFormattedFile } from "./logger";
import callOllama from "./ollama";

export async function runLuna(app: App) {
	const files = app.vault.getMarkdownFiles();

	if (files.length === 0) {
		new Notice("No markdown files found.");
		return;
	}

	let allText = "";

	for (const file of files) {
		const content = await app.vault.read(file);
		allText += content + "\n\n";
	}

	const response = await callOllama(app, allText, {
		systemPrompt: "Summarize the following collection of thoughts as a single 3-line haiku. Do not include any explanations or titles. Only respond with the haiku.",
		model: "gemma3",
		temperature: 0.8,
	});

	await logToFormattedFile(app, response.toString());

	new Notice(`Logged haiku from ${files.length} notes.`);
}
