import { useApp } from '@/hooks/useApp';
import { App as ObsidianApp, PluginManifest, Plugin } from 'obsidian';

interface AppWithPlugins extends ObsidianApp {
  plugins: {
    plugins: {
      [key: string]: Plugin;
    };
  };
}

export const usePluginManifest = (): PluginManifest | undefined => {
  const app = useApp() as AppWithPlugins;

  if (!app) return undefined;

  const dreamJournalPlugin = app.plugins.plugins['dream-journal'];
  if (!dreamJournalPlugin) return undefined;

  return dreamJournalPlugin.manifest;
};