import { App } from 'obsidian';
import { useContext } from 'react';
import { AppContext } from '@/context';

export const useApp = (): App | undefined => {
  return useContext(AppContext);
};