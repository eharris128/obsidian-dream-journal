import { useContext } from 'react';
import { PluginContext } from '@/context';
import type DreamJournalPlugin from '@/main';

export const usePlugin = (): DreamJournalPlugin | undefined => {
  return useContext(PluginContext);
};
