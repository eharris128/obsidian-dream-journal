import { Plugin, WorkspaceLeaf, ItemView } from 'obsidian';
import { createRoot, Root } from 'react-dom/client';
import { StrictMode } from 'react';
import { ReactView } from '@/views/ReactView';
import { AppContext } from '@/context';

const VIEW_TYPE_EXAMPLE = 'example-react-view';

class ExampleReactView extends ItemView {
    root: Root | null = null;

    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
    }

    getViewType() {
        return VIEW_TYPE_EXAMPLE;
    }

    getDisplayText() {
        return 'Example React View';
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

        this.addRibbonIcon('dice', 'Open Example React View', () => {
            this.activateView();
        });
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

    onunload() {
        this.app.workspace.detachLeavesOfType(VIEW_TYPE_EXAMPLE);
    }
}