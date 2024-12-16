import { useState, useEffect, useRef } from 'react';
import { EmotionWheel } from '@/components/EmotionWheel';

interface NewDreamProps {
  onSubmit: (dreamTitle: string, dreamContent: string, emotions: string[], people: string[]) => void;
}

export const NewDream: React.FC<NewDreamProps> = ({ onSubmit }) => {
  const [dreamTitle, setDreamTitle] = useState('');
  const [dreamContent, setDreamContent] = useState('');
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [people, setPeople] = useState<string[]>([]);
  const [newPerson, setNewPerson] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const angerEmotionRef = useRef<(SVGGElement | null)[]>([]);
  const saveDreamButtonRef = useRef<HTMLButtonElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setIsFormValid(dreamTitle.trim() !== '' && dreamContent.trim() !== '');
  }, [dreamTitle, dreamContent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (isFormValid) {
      const emotionsSection = selectedEmotions.length > 0
        ? `\n\n# I felt:\n${selectedEmotions.join(', ')}`
        : '';
      const peopleSection = people.length > 0
        ? `\n\n# People:\n- ${people.join('\n- ')}`
        : '';
      const fullDreamContent = `${dreamContent}${emotionsSection}${peopleSection}`;
      onSubmit(dreamTitle, fullDreamContent, selectedEmotions, people);
      setDreamTitle('');
      setDreamContent('');
      setSelectedEmotions([]);
      setPeople([]);
      setNewPerson('');
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

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      angerEmotionRef?.current[0]?.focus();
    }
  };

  const handleEmotionWheelTabPress = () => {
    saveDreamButtonRef.current?.focus();
  };

  const handleEmotionWheelShiftTabPress = () => {
    descriptionRef.current?.focus();
  }

  const handleAddPerson = () => {
    if (newPerson.trim() !== '') {
      setPeople(prev => [...prev, newPerson.trim()]);
      setNewPerson('');
    }
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
          onKeyDown={handleTextareaKeyDown}
          placeholder="Describe your dream..."
          rows={4}
          required
          ref={descriptionRef}
        />
      </div>
      <div className="form-group">
        <label>I felt:</label>
        <EmotionWheel
          selectedEmotions={selectedEmotions}
          onEmotionToggle={handleEmotionToggle}
          angerEmotionRef={angerEmotionRef}
          onTabPress={handleEmotionWheelTabPress}
          onShiftTabPress={handleEmotionWheelShiftTabPress}
        />
      </div>
      <div className="form-group">
        <label>Significant people present in the dream:</label>
        <input
          className="dream-journal-people-input"
          type="text"
          value={newPerson}
          onChange={(e) => setNewPerson(e.target.value)}
          placeholder="Enter person's name..."
          onKeyDown={(e) => { if (e.key === 'Enter') handleAddPerson(); }}
        />
        <button type="button" onClick={handleAddPerson}>Add</button>
        <div className="people-bubbles">
          {people.map((person, index) => (
            <span key={index} className="bubble">{person}</span>
          ))}
        </div>
      </div>
      <button
        id="submit-dream"
        className="dream-journal-submit-button"
        type="submit"
        disabled={!isFormValid}
        ref={saveDreamButtonRef}
      >
        Save dreams!
      </button>
    </form>
  );
};