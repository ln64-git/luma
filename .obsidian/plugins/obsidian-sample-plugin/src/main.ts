import { Notice, Plugin } from 'obsidian';
import { SettingTab, DEFAULT_SETTINGS, LumaSettings } from './ui/settings';
import { runLuna } from './luma';
import { clearLog } from './utility/logger';
import { initDB, persistDB } from './db';

export default class MyPlugin extends Plugin {
  settings: LumaSettings;
  async onload() {
    await this.loadSettings();
    this.addUI();
    this.addSettingTab(new SettingTab(this.app, this));

    await initDB(this.app); // ✅ important to await
    await clearLog(this.app);

    this.app.workspace.onLayoutReady(() => {
      // runLuna(this.app);
    });
  }

  async onunload() {
    await persistDB(this.app); // ✅ epnsure it's saved to vault
    new Notice('💾 Luma: Database saved');
  }

  private addUI() {
    this.addRibbonIcon('sparkle', 'Luma', () => {
      runLuna(this.app);
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
