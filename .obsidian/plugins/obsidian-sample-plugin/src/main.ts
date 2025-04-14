// main.ts
import { Notice, Plugin } from 'obsidian';
import { SettingTab, DEFAULT_SETTINGS, LumaSettings } from './settings';
import { SampleModal } from './modal';

export default class MyPlugin extends Plugin {
	settings: LumaSettings;
	async onload() {
		await this.loadSettings();
		this.addUI();
		this.registerCommands();
		this.addSettingTab(new SettingTab(this.app, this));
	}

	private addUI() {
		const ribbon = this.addRibbonIcon('sparkle', 'Luma', () => {
			new Notice('This is a notice!');
		});
		ribbon.addClass('my-plugin-ribbon-class');
		this.addStatusBarItem().setText('Luma running.');
	}
	private registerCommands() {
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Run Luma',
			callback: () => {
				new SampleModal(this.app).open();
			}
		});
	}

	private async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}
	async saveSettings() {
		await this.saveData(this.settings);
	}
}

export type { LumaSettings };
