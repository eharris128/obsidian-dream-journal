import { App } from 'obsidian';
import { createContext } from 'react';
import type DreamJournalPlugin from '@/main';

export const AppContext = createContext<App | undefined>(undefined);
export const PluginContext = createContext<DreamJournalPlugin | undefined>(undefined);
