import { useState, useEffect } from 'react';
import { EmotionWheel } from './EmotionWheel';

interface NewDreamProps {
  onSubmit: (dreamTitle: string, dreamContent: string, emotions: string[]) => void;
}

export const NewDream: React.FC<NewDreamProps> = ({ onSubmit }) => {
  const [dreamTitle, setDreamTitle] = useState('');
  const [dreamContent, setDreamContent] = useState('');
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setIsFormValid(dreamTitle.trim() !== '' && dreamContent.trim() !== '');
  }, [dreamTitle, dreamContent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (isFormValid) {
      const emotionsSection = selectedEmotions.length > 0 
        ? `\n\n# I felt:)\n${selectedEmotions.join(', ')}`
        : '';
      const fullDreamContent = `${dreamContent}${emotionsSection}`;
      onSubmit(dreamTitle, fullDreamContent, selectedEmotions);
      setDreamTitle('');
      setDreamContent('');
      setSelectedEmotions([]);
      setIsSubmitted(false);
    }
  };

  const handleEmotionToggle = (emotion: string) => {
    setSelectedEmotions(prev => 
      prev.includes(emotion) 
        ? prev.filter(e => e !== emotion) 
        : [...prev, emotion]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="dream-journal-new-dream-form">
      <div className="form-group">
        <label htmlFor="dream-title">Dream title <span className="required">*</span></label>
        <input
          id="dream-title"
          type="text"
          value={dreamTitle}
          onChange={(e) => setDreamTitle(e.target.value)}
          placeholder="Enter dream title..."
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="dream-content">Dream description <span className="required">*</span></label>
        <textarea
          id="dream-content"
          value={dreamContent}
          onChange={(e) => setDreamContent(e.target.value)}
          placeholder="Describe your dream..."
          rows={4}
          required
        />
      </div>
      <div className="form-group">
        <label>I felt:</label>
        <EmotionWheel selectedEmotions={selectedEmotions} onEmotionToggle={handleEmotionToggle} />
      </div>
      <button 
        id="submit-dream"
        className="dream-journal-submit-button" 
        type="submit" 
        disabled={!isFormValid}
      >
        Save dream
      </button>
    </form>
  );
};