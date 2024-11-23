import { useState, useEffect } from 'react';

interface NewDreamProps {
  onSubmit: (dreamTitle: string, dreamContent: string) => void;
}

export const NewDream: React.FC<NewDreamProps> = ({ onSubmit }) => {
  const [dreamTitle, setDreamTitle] = useState('');
  const [dreamContent, setDreamContent] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    setIsFormValid(dreamTitle.trim() !== '' && dreamContent.trim() !== '');
  }, [dreamTitle, dreamContent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      onSubmit(dreamTitle, dreamContent);
      setDreamTitle('');
      setDreamContent('');
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
          className={dreamTitle.trim() ? 'valid' : 'invalid'}
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
          className={dreamContent.trim() ? 'valid' : 'invalid'}
        />
      </div>
      <button type="submit" disabled={!isFormValid} className={isFormValid ? 'valid' : 'invalid'}>
        Save dream
      </button>
    </form>
  );
};