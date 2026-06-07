import { useState } from 'react';
import { Notice, normalizePath } from 'obsidian';
import { NewDream } from '@/components/NewDream';
import { usePlugin } from '@/hooks/usePlugin';
import { format } from 'date-fns';

// Characters Obsidian does not allow in file names (plus link-breaking # ^ [ ])
const INVALID_FILENAME_CHARS = /[\\/:*?"<>|#^[\]]/g;

interface DreamEntry {
  title: string;
  content: string;
  emotions: string[];
}

export const Dream: React.FC = () => {
    const [dreams, setDreams] = useState<DreamEntry[]>([]);
    const plugin = usePlugin();

    const handleNewDream = async (dreamTitle: string, dreamContent: string, emotions: string[]) => {
        if (!plugin) {
            console.error('Dream journal plugin is not available');
            return;
        }

        const { vault } = plugin.app;
        const safeTitle = dreamTitle.replace(INVALID_FILENAME_CHARS, '-').trim() || 'dream';
        const fileName = `${safeTitle}-${format(new Date(), 'yyyy-MM-dd-HHmmss')}.md`;
        const filePath = normalizePath(`${plugin.settings.dreamsDir}/${fileName}`);

        try {
            // Make sure the configured folder exists, then create the file
            await plugin.ensureDreamsFolder();
            await vault.create(filePath, dreamContent);
            setDreams([...dreams, { title: dreamTitle, content: dreamContent, emotions }]);
            new Notice('Dream saved');
        } catch (error) {
            console.error('Failed to save dream:', error);
            new Notice('Failed to save dream');
        }
    };
    return (
        <div>
            <h1>What did I dream about?</h1>
            <NewDream onSubmit={handleNewDream} />
        </div>
    );
};