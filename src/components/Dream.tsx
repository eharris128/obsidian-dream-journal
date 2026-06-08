import { useState } from 'react';
import { Notice, normalizePath } from 'obsidian';
import { NewDream, NewDreamData } from '@/components/NewDream';
import { usePlugin } from '@/hooks/usePlugin';
import { computeLucidScores, LUCID_ITEMS } from '@/lucid';
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

    const handleNewDream = async ({ title, content, emotions, lucidResponses }: NewDreamData) => {
        if (!plugin) {
            console.error('Dream journal plugin is not available');
            return;
        }

        const { vault, fileManager } = plugin.app;
        const safeTitle = title.replace(INVALID_FILENAME_CHARS, '-').trim() || 'dream';
        const fileName = `${safeTitle}-${format(new Date(), 'yyyy-MM-dd-HHmmss')}.md`;
        const filePath = normalizePath(`${plugin.settings.dreamsDir}/${fileName}`);

        try {
            // Make sure the configured folder exists, then create the file
            await plugin.ensureDreamsFolder();
            const file = await vault.create(filePath, content);

            // Store LuCiD factor scores as note properties for later analysis.
            const lucidScores = computeLucidScores(lucidResponses);
            if (lucidScores) {
                await fileManager.processFrontMatter(file, (frontmatter) => {
                    for (const [factorKey, score] of Object.entries(lucidScores.factors)) {
                        frontmatter[`lucid-${factorKey}`] = score;
                    }
                    frontmatter['lucid-answered'] = `${lucidScores.answered}/${LUCID_ITEMS.length}`;
                });
            }

            setDreams([...dreams, { title, content, emotions }]);
            new Notice('Dream saved');
        } catch (error) {
            console.error('Failed to save dream:', error);
            new Notice('Failed to save dream');
        }
    };
    return (
        <div>
            <h1>What did I dream about?</h1>
            <NewDream onSubmit={(data) => void handleNewDream(data)} />
        </div>
    );
};