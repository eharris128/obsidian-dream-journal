import { useState } from 'react';
import { NewDream } from '@/components/NewDream';
import { useApp } from '@/hooks/useApp';
import { moment } from 'obsidian';

const DREAM_JOURNAL_DIR = 'dream-journal';
const DREAMS_DIR = `${DREAM_JOURNAL_DIR}/dreams`;

export const Dream: React.FC = () => {
    const [dreams, setDreams] = useState<string[]>([]);
    const app = useApp();

    const handleNewDream = async (dreamContent: string) => {
        if (!app) {
            console.error('Obsidian app is not available');
            return;
        }

        const { vault } = app;
        const fileName = `Dream-${moment().format('YYYY-MM-DD-HHmmss')}.md`;
        const filePath = `${DREAMS_DIR}/${fileName}`;

        try {
            // Create the file
            await vault.create(filePath, dreamContent);
            setDreams([...dreams, dreamContent]);
        } catch (error) {
            console.error('Failed to save dream:', error);
        }
    };

    return (
        <div>
            <h1>Dream Journal</h1>
            <NewDream onSubmit={handleNewDream} />
            <h2>Your Dreams:</h2>
            <ul>
                {dreams.map((dream, index) => (
                    <li key={index}>{dream}</li>
                ))}
            </ul>
        </div>
    );
};