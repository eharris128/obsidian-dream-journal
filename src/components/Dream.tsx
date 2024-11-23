import { useState } from 'react';
import { NewDream } from '@/components/NewDream';
import { useApp } from '@/hooks/useApp';
import { moment } from 'obsidian';

const DREAM_JOURNAL_DIR = 'dream-journal';
const DREAMS_DIR = `${DREAM_JOURNAL_DIR}/dreams`;

interface DreamEntry {
  title: string;
  content: string;
}

export const Dream: React.FC = () => {
    const [dreams, setDreams] = useState<DreamEntry[]>([]);
    const app = useApp();

    const handleNewDream = async (dreamTitle: string, dreamContent: string) => {
        if (!app) {
            console.error('Obsidian app is not available');
            return;
        }

        const { vault } = app;
        const fileName = `${dreamTitle}-${moment().format('YYYY-MM-DD-HHmmss')}.md`;
        const filePath = `${DREAMS_DIR}/${fileName}`;
        const fileContent = `# ${dreamTitle}\n\n${dreamContent}`;

        try {
            // Create the file
            await vault.create(filePath, fileContent);
            setDreams([...dreams, { title: dreamTitle, content: dreamContent }]);
        } catch (error) {
            console.error('Failed to save dream:', error);
        }
    };

    return (
        <div>
            <h1>What did I dream about?</h1>
            <NewDream onSubmit={handleNewDream} />
            <h2>Previous dreams:</h2>
            <ul>
                {dreams.map((dream, index) => (
                    <li key={index}>
                        <h3>{dream.title}</h3>
                        <p>{dream.content}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};