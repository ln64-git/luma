// main.ts
import { Notice, Plugin } from 'obsidian';
import { SampleSettingTab } from './settings';
import { DEFAULT_SETTINGS, LumaSettings } from './settings';
import { SampleModal } from './modal';

export default class MyPlugin extends Plugin {
	settings: LumaSettings;

	async onload() {
		await this.loadSettings();

		const ribbonIconEl = this.addRibbonIcon('sparkle', 'Luma', () => {
			new Notice('This is a notice!');
		});
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Luma running.');

		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Run Luma',
			callback: () => {
				new SampleModal(this.app).open();
			}
		});

		this.addSettingTab(new SampleSettingTab(this.app, this));

		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() { }

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

export type { LumaSettings };
