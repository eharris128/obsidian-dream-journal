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

// Human-readable summary of emotions and people, appended to the note body.
const buildBodySummary = (emotions: string[], people: string[]): string => {
    const emotionsSection = emotions.length > 0
        ? `\n\n# I felt:\n${emotions.join(', ')}`
        : '';
    const peopleSection = people.length > 0
        ? `\n\n# People:\n- ${people.join('\n- ')}`
        : '';
    return `${emotionsSection}${peopleSection}`;
};

export const Dream: React.FC = () => {
    const [dreams, setDreams] = useState<DreamEntry[]>([]);
    const plugin = usePlugin();

    const handleNewDream = async ({ title, content, emotions, people, lucidResponses }: NewDreamData) => {
        if (!plugin) {
            console.error('Dream journal plugin is not available');
            return;
        }

        const { vault, fileManager } = plugin.app;
        const safeTitle = title.replace(INVALID_FILENAME_CHARS, '-').trim() || 'dream';
        const fileName = `${safeTitle}-${format(new Date(), 'yyyy-MM-dd-HHmmss')}.md`;
        const filePath = normalizePath(`${plugin.settings.dreamsDir}/${fileName}`);
        const body = plugin.settings.summaryInBody
            ? `${content}${buildBodySummary(emotions, people)}`
            : content;

        try {
            // Make sure the configured folder exists, then create the file
            await plugin.ensureDreamsFolder();
            const file = await vault.create(filePath, body);

            // Store emotions, people and LuCiD factor scores as note properties
            // so other plugins (Dataview, Bases, ...) can query them.
            const lucidScores = computeLucidScores(lucidResponses);
            if (emotions.length > 0 || people.length > 0 || lucidScores) {
                await fileManager.processFrontMatter(file, (frontmatter: Record<string, unknown>) => {
                    if (emotions.length > 0) frontmatter['emotions'] = emotions;
                    if (people.length > 0) frontmatter['people'] = people;
                    if (lucidScores) {
                        for (const [factorKey, score] of Object.entries(lucidScores.factors)) {
                            frontmatter[`lucid-${factorKey}`] = score;
                        }
                        frontmatter['lucid-answered'] = `${lucidScores.answered}/${LUCID_ITEMS.length}`;
                    }
                });
            }

            setDreams([...dreams, { title, content: body, emotions }]);
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
