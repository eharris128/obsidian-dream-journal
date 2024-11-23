import { useApp } from '@/hooks/useApp';
import { PluginManifest } from 'obsidian';

export const usePluginManifest = (): PluginManifest | undefined => {
  const app = useApp();
  if (!app) return undefined;

  const dreamJournalPlugin = app.plugins.plugins['dream-journal'];
  if (!dreamJournalPlugin) return undefined;

  return dreamJournalPlugin.manifest;
};