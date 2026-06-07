import { PluginManifest } from 'obsidian';
import { usePlugin } from '@/hooks/usePlugin';

export const usePluginManifest = (): PluginManifest | undefined => {
  return usePlugin()?.manifest;
};
