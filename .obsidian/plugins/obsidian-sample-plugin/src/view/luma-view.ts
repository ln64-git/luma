import { ItemView, WorkspaceLeaf } from "obsidian";

export const LUMA_VIEW_TYPE = "luma-sidebar-view";

export class LumaView extends ItemView {
  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  getViewType(): string {
    return LUMA_VIEW_TYPE;
  }

  getDisplayText(): string {
    return "Luma Dashboard";
  }

  async onOpen() {
    const container = this.containerEl.children[1];
    container.empty();
    container.createEl("h2", { text: "🌙 Luma Panel" });
    container.createEl("p", { text: "Vault insights, reflections, and tools go here." });
  }

  async onClose() {
    // Clean up if needed
  }
}
