import { useState } from 'react';

interface NewDreamProps {
  onSubmit: (dreamContent: string) => void;
}

export const NewDream: React.FC<NewDreamProps> = ({ onSubmit }) => {
  const [dreamContent, setDreamContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dreamContent.trim()) {
      onSubmit(dreamContent);
      setDreamContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={dreamContent}
        onChange={(e) => setDreamContent(e.target.value)}
        placeholder="Describe your dream..."
        rows={4}
        style={{ width: '100%', marginBottom: '10px' }}
      />
      <button type="submit">Save Dream</button>
    </form>
  );
};