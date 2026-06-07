import { LUCID_ITEMS, LUCID_SCALE_MAX } from '@/lucid';

const SCALE_VALUES = Array.from({ length: LUCID_SCALE_MAX + 1 }, (_, value) => value);

interface LucidQuestionnaireProps {
  responses: (number | null)[];
  onChange: (responses: (number | null)[]) => void;
}

export const LucidQuestionnaire: React.FC<LucidQuestionnaireProps> = ({ responses, onChange }) => {
  const setResponse = (itemIndex: number, value: number) => {
    const next = [...responses];
    // Clicking the selected value again clears the answer.
    next[itemIndex] = next[itemIndex] === value ? null : value;
    onChange(next);
  };

  return (
    <div className="lucid-questionnaire">
      <p className="lucid-scale-hint">
        Rate each statement about this dream: 0 = strongly disagree, 5 = strongly agree.
        Unanswered statements are skipped.
      </p>
      <ol className="lucid-items">
        {LUCID_ITEMS.map((text, itemIndex) => (
          <li key={itemIndex} className="lucid-item">
            <span className="lucid-item-text">{text}</span>
            <div className="lucid-item-scale" role="radiogroup" aria-label={text}>
              {SCALE_VALUES.map((value) => (
                <label
                  key={value}
                  className={`lucid-scale-option ${responses[itemIndex] === value ? 'is-selected' : ''}`}
                >
                  <input
                    type="radio"
                    name={`lucid-item-${itemIndex}`}
                    value={value}
                    checked={responses[itemIndex] === value}
                    onChange={() => undefined}
                    onClick={() => setResponse(itemIndex, value)}
                  />
                  {value}
                </label>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};
