import { StrictMode } from 'react';
import { ItemView, WorkspaceLeaf } from 'obsidian';
import { createRoot, Root } from 'react-dom/client';
import type { ComponentType } from 'react';
import { AppContext } from '@/context';

export class ReactView extends ItemView {
    root: Root | null = null;
    component: ComponentType;

    constructor(leaf: WorkspaceLeaf, component: ComponentType, private viewType: string, private displayText: string) {
        super(leaf);
        this.component = component;
    }

    getViewType(): string {
        return this.viewType;
    }

    getDisplayText(): string {
        return this.displayText;
    }

    getIcon(): string {
        return 'moon';
    }

    async onOpen() {
        const { containerEl } = this;
        containerEl.empty();

        const contentContainer = containerEl.createDiv({ cls: 'dream-journal-view' });
        this.root = createRoot(contentContainer);
        this.root.render(
            <AppContext.Provider value={this.app}>
                <StrictMode>
                    <this.component />
                </StrictMode>
            </AppContext.Provider>
        );
    }

    async onClose() {
        this.root?.unmount();
    }
}