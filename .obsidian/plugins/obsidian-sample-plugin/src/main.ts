import { Notice, Plugin } from 'obsidian';
import { SettingTab, DEFAULT_SETTINGS, LumaSettings } from './ui/settings';
import { clearLog } from './utility/logger';
import { initDB, persistDB } from './db';
import { LUMA_VIEW_TYPE, LumaView } from './view/luma-view';

export default class MyPlugin extends Plugin {
  settings: LumaSettings;

  async onload() {
    await this.loadSettings();
    this.registerView(LUMA_VIEW_TYPE, (leaf) => new LumaView(leaf));
    this.addUI();
    this.addSettingTab(new SettingTab(this.app, this));

    await initDB(this.app);
    await clearLog(this.app);
  }

  async onunload() {
    await persistDB(this.app);
    this.app.workspace.detachLeavesOfType(LUMA_VIEW_TYPE);
    new Notice('💾 Luma: Database saved');
  }

  private addUI() {
    this.addRibbonIcon('sparkle', 'Luma', async () => {
      const leaf = this.app.workspace.getRightLeaf(false);
      if (leaf) {
        await leaf.setViewState({ type: LUMA_VIEW_TYPE, active: true });
        this.app.workspace.revealLeaf(leaf);
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
