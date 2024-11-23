import { useState, useEffect } from 'react';

interface NewDreamProps {
  onSubmit: (dreamTitle: string, dreamContent: string, emotions: string[]) => void;
}

const EMOTIONS = [
  'Joy', 'Trust', 'Fear', 'Surprise', 'Sadness', 'Disgust', 'Anger', 'Anticipation',
  'Ecstasy', 'Admiration', 'Terror', 'Amazement', 'Grief', 'Loathing', 'Rage', 'Vigilance',
  'Serenity', 'Acceptance', 'Apprehension', 'Distraction', 'Pensiveness', 'Boredom', 'Annoyance', 'Interest',
  'Love', 'Submission', 'Awe', 'Disapproval', 'Remorse', 'Contempt', 'Aggressiveness', 'Optimism'
];

export const NewDream: React.FC<NewDreamProps> = ({ onSubmit }) => {
  const [dreamTitle, setDreamTitle] = useState('');
  const [dreamContent, setDreamContent] = useState('');
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setIsFormValid(dreamTitle.trim() !== '' && dreamContent.trim() !== '' && selectedEmotions.length > 0);
  }, [dreamTitle, dreamContent, selectedEmotions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (isFormValid) {
      onSubmit(dreamTitle, dreamContent, selectedEmotions);
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
        <label>Emotions felt <span className="required">*</span></label>
        <div className="emotions-container">
          {EMOTIONS.map(emotion => (
            <button
              key={emotion}
              type="button"
              className={`emotion-button ${selectedEmotions.includes(emotion) ? 'selected' : ''}`}
              onClick={() => handleEmotionToggle(emotion)}
            >
              {emotion}
            </button>
          ))}
        </div>
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