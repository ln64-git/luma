// main.ts
import { Notice, Plugin } from 'obsidian';
import { SettingTab, DEFAULT_SETTINGS, LumaSettings } from './settings';
import { runLuna } from './luma';
import { clearLog } from './logger';


export default class MyPlugin extends Plugin {
  settings: LumaSettings;
  async onload() {
    await this.loadSettings();
    this.addUI();
    this.addSettingTab(new SettingTab(this.app, this));

    await clearLog(this.app) 

    this.app.workspace.onLayoutReady(() => {
      runLuna(this.app);
    });
  }


  onclose() {
    const path = "logs/luma-log.json";
    this.app.vault.adapter.write(path, "");
  }

  private addUI() {
    this.addRibbonIcon('sparkle', 'Luma', () => {
      // runLuna(this.app)
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
