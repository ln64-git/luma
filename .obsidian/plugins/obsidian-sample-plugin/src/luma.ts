import { App, Notice } from "obsidian";
import { logToFile, logToFormattedFile } from "./logger";
import callOllama from "./ollama";

export async function runLuna(app: App) {
	const files = app.vault.getMarkdownFiles();

	if (files.length === 0) {
		new Notice("No markdown files found.");
		return;
	}

	const firstFile = files[1]; // Adjust as needed
	const content = await app.vault.read(firstFile);

	const response = await callOllama(app, content, {
		systemPrompt: "Respond only with a haiku. Do not include any explanations, titles, or questions. Format your response as a 3-line haiku only.",
		model: "gemma3",
		temperature: 0.3,
	});


	await logToFormattedFile(app, response.toString());

	new Notice(`Logged: ${firstFile.name}`);
}
