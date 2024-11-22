import { Plugin, WorkspaceLeaf, ItemView } from 'obsidian';
import { createRoot, Root } from 'react-dom/client';
import { StrictMode } from 'react';
import { ReactView } from '@/views/ReactView';
import { AppContext } from '@/context';

const VIEW_TYPE_EXAMPLE = 'example-react-view';
const DREAM_JOURNAL_DIR = 'dream-journal';
const DREAMS_DIR = `${DREAM_JOURNAL_DIR}/dreams`;

class ExampleReactView extends ItemView {
    root: Root | null = null;

    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
    }

    getViewType() {
        return VIEW_TYPE_EXAMPLE;
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
                    <ReactView />
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
            VIEW_TYPE_EXAMPLE,
            (leaf) => new ExampleReactView(leaf)
        );

        this.addRibbonIcon('moon', 'Open dream journal', () => {
            this.activateView();
        });

        // Create the dream-journal and dreams directories if they don't exist
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

        let leaf = workspace.getLeavesOfType(VIEW_TYPE_EXAMPLE)[0];
        if (!leaf) {
            leaf = workspace.getLeaf(false);
            await leaf.setViewState({
                type: VIEW_TYPE_EXAMPLE,
                active: true,
            });
        }
        workspace.revealLeaf(leaf);
    }
}