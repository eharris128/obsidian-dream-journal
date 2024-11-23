import { Plugin, WorkspaceLeaf, ItemView } from 'obsidian';
import { createRoot, Root } from 'react-dom/client';
import { StrictMode } from 'react';
import { TabView } from '@/views/TabView';
import { AppContext } from '@/context';

const DREAM_JOURNAL_TAB = 'dream-journal-tab-view';
const DREAM_JOURNAL_DIR = 'dream-journal';
const DREAMS_DIR = `${DREAM_JOURNAL_DIR}/dreams`;

class TabViewContainer extends ItemView {
    root: Root | null = null;

    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
    }

    getViewType() {
        return DREAM_JOURNAL_TAB;
    }

    getDisplayText() {
        return 'Record dreams';
    }

    async onOpen() {
        const { containerEl } = this;
        this.root = createRoot(containerEl);
        this.root.render(
            <AppContext.Provider value={this.app}>
                <StrictMode>
                    <TabView />
                </StrictMode>
            </AppContext.Provider>
        );
    }

    async onClose() {
        this.root?.unmount();
    }
}

export default class MyReactPlugin extends Plugin {
    async onload() {
        this.registerView(
            DREAM_JOURNAL_TAB,
            (leaf) => new TabViewContainer(leaf)
        );

        this.addRibbonIcon('moon', 'Open dream journal', () => {
            this.activateView();
        });

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
}
