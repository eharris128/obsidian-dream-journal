import { useState } from 'react';
import { NewDream } from '@/components/NewDream';
import { useApp } from '@/hooks/useApp';
import { moment } from 'obsidian';

const DREAM_JOURNAL_DIR = 'dream-journal';
const DREAMS_DIR = `${DREAM_JOURNAL_DIR}/dreams`;

interface DreamEntry {
  title: string;
  content: string;
  emotions: string[];
}

export const Dream: React.FC = () => {
    const [dreams, setDreams] = useState<DreamEntry[]>([]);
    const app = useApp();

    const handleNewDream = async (dreamTitle: string, dreamContent: string, emotions: string[]) => {
        if (!app) {
            console.error('Obsidian app is not available');
            return;
        }

        const { vault } = app;
        const fileName = `${dreamTitle}-${moment().format('YYYY-MM-DD-HHmmss')}.md`;
        const filePath = `${DREAMS_DIR}/${fileName}`;

        try {
            // Create the file
            await vault.create(filePath, dreamContent);
            setDreams([...dreams, { title: dreamTitle, content: dreamContent, emotions }]);
        } catch (error) {
            console.error('Failed to save dream:', error);
        }
    };
    return (
        <div>
            <h1>What did I dream about?</h1>
            <NewDream onSubmit={handleNewDream} />
        </div>
    );
};