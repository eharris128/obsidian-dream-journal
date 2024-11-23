import { App, Plugin, PluginSettingTab } from 'obsidian';
import { StrictMode } from 'react';
import { createRoot, Root } from 'react-dom/client';

import { AppContext } from '@/context';
import { TabView } from '@/views/TabView';
import { SettingsView } from '@/views/SettingsView';
import { ReactView } from '@/views/ReactView';

const DREAM_JOURNAL_TAB = 'dream-journal-tab-view';
const DREAM_JOURNAL_DIR = 'dream-journal';
const DREAMS_DIR = `${DREAM_JOURNAL_DIR}/dreams`;

class DreamJournalSettingTab extends PluginSettingTab {
    plugin: DreamJournalPlugin;
    private reactRoot: Root | null = null;

    constructor(app: App, plugin: DreamJournalPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        const settingsContainer = containerEl.createDiv();
        this.reactRoot = createRoot(settingsContainer);

        this.reactRoot.render(
            <StrictMode>
                <AppContext.Provider value={this.app}>
                    <SettingsView />
                </AppContext.Provider>
            </StrictMode>
        );
    }

    hide(): void {
        this.reactRoot?.unmount();
        this.reactRoot = null;
    }
}

const OPEN_DREAM_JOURNAL = 'Open dream journal';
const RECORD_DREAMS = 'Record dreams';

export default class DreamJournalPlugin extends Plugin {
    async onload() {
        this.registerView(
            DREAM_JOURNAL_TAB,
            (leaf) => new ReactView(leaf, TabView, DREAM_JOURNAL_TAB, RECORD_DREAMS)
        );

        this.addRibbonIcon('moon', OPEN_DREAM_JOURNAL, () => {
            this.activateView();
        });

        this.addCommand({
            id: 'open-dream-journal',
            name: RECORD_DREAMS,
            callback: () => {
                this.activateView();
            },
            hotkeys: []
        });

        this.addSettingTab(new DreamJournalSettingTab(this.app, this));

        await this.createDreamJournalDirectories();
    }

    async createDreamJournalDirectories() {
        const { vault } = this.app;
        if (!(await vault.adapter.exists(DREAM_JOURNAL_DIR))) {
            await vault.createFolder(DREAM_JOURNAL_DIR);
        }
        if (!(await vault.adapter.exists(DREAMS_DIR))) {
            await vault.createFolder(DREAMS_DIR);
        }
    }

    async activateView() {
        const { workspace } = this.app;

        let leaf = workspace.getLeavesOfType(DREAM_JOURNAL_TAB)[0];
        if (!leaf) {
            leaf = workspace.getLeaf(false);
            await leaf.setViewState({
                type: DREAM_JOURNAL_TAB,
                active: true,
            });
        }
        workspace.revealLeaf(leaf);
    }

    onunload() {
        const leaves = this.app.workspace.getLeavesOfType('dream-journal-settings');
        leaves.forEach((leaf) => leaf.detach());
    }
}
