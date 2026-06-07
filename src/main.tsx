import { App, Plugin, PluginSettingTab, Setting, normalizePath } from 'obsidian';
import { StrictMode } from 'react';
import { createRoot, Root } from 'react-dom/client';
// import "react-datepicker/dist/react-datepicker.css";

import { AppContext, PluginContext } from '@/context';
import { DEFAULT_DREAMS_DIR } from '@/constants';
import { TabView } from '@/views/TabView';
import { SettingsView } from '@/views/SettingsView';
import { ReactView } from '@/views/ReactView';
import { DreamExport } from '@/components/DreamExport';

const DREAM_JOURNAL_TAB = 'dream-journal-tab-view';
const DREAM_EXPORT_TAB = 'dream-export-tab-view';

interface DreamJournalSettings {
    dreamsDir: string;
}

const DEFAULT_SETTINGS: DreamJournalSettings = {
    dreamsDir: DEFAULT_DREAMS_DIR,
};

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

        new Setting(containerEl)
            .setName('Dreams folder')
            .setDesc('Vault folder where new dreams are saved. Leave empty for the default.')
            .addText((text) =>
                text
                    .setPlaceholder(DEFAULT_SETTINGS.dreamsDir)
                    .setValue(this.plugin.settings.dreamsDir)
                    .onChange(async (value) => {
                        await this.plugin.updateDreamsDir(value);
                    })
            );

        this.reactRoot?.unmount();
        const settingsContainer = containerEl.createDiv();
        this.reactRoot = createRoot(settingsContainer);

        this.reactRoot.render(
            <StrictMode>
                <AppContext.Provider value={this.app}>
                    <PluginContext.Provider value={this.plugin}>
                        <SettingsView />
                    </PluginContext.Provider>
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
const EXPORT_DREAMS = 'Export dreams';

export default class DreamJournalPlugin extends Plugin {
    settings: DreamJournalSettings = { ...DEFAULT_SETTINGS };

    async onload() {
        await this.loadSettings();

        this.registerView(
            DREAM_JOURNAL_TAB,
            (leaf) => new ReactView(leaf, TabView, DREAM_JOURNAL_TAB, RECORD_DREAMS, this)
        );

        this.registerView(
            DREAM_EXPORT_TAB,
            (leaf) => new ReactView(leaf, DreamExport, DREAM_EXPORT_TAB, EXPORT_DREAMS, this)
        );

        this.addRibbonIcon('moon', OPEN_DREAM_JOURNAL, () => {
            this.activateView();
        });

        this.addCommand({
            id: 'open-dream-journal',
            name: RECORD_DREAMS,
            callback: () => {
                this.activateView(DREAM_JOURNAL_TAB);
            },
            hotkeys: []
        });

        this.addCommand({
            id: 'open-dream-exporter',
            name: EXPORT_DREAMS,
            callback: () => {
                this.activateView(DREAM_EXPORT_TAB);
            },
            hotkeys: []
        });

        this.addSettingTab(new DreamJournalSettingTab(this.app, this));

        this.app.workspace.onLayoutReady(() => {
            this.ensureDreamsFolder().catch((error) =>
                console.error('Failed to create dream journal folders:', error)
            );
        });
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    async updateDreamsDir(value: string) {
        const trimmed = value.trim();
        this.settings.dreamsDir = trimmed ? normalizePath(trimmed) : DEFAULT_SETTINGS.dreamsDir;
        await this.saveSettings();
    }

    // Creates the configured dreams folder, including any missing ancestors.
    async ensureDreamsFolder() {
        const { vault } = this.app;
        const segments = this.settings.dreamsDir.split('/').filter(Boolean);
        let path = '';
        for (const segment of segments) {
            path = path ? `${path}/${segment}` : segment;
            if (!vault.getFolderByPath(path)) {
                await vault.createFolder(path);
            }
        }
    }

    async activateView(viewType: string = DREAM_JOURNAL_TAB) {
        const { workspace } = this.app;

        let leaf = workspace.getLeavesOfType(viewType)[0];
        if (!leaf) {
            leaf = workspace.getLeaf(false);
            await leaf.setViewState({
                type: viewType,
                active: true,
            });
        }
        workspace.revealLeaf(leaf);
    }
}
