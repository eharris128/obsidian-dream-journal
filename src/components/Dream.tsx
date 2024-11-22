import { useState } from 'react';
import { NewDream } from '@/components/NewDream';

export const Dream: React.FC = () => {
    const [dreams, setDreams] = useState<string[]>([]);

    const handleNewDream = (dreamContent: string) => {
        setDreams([...dreams, dreamContent]);
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