import { useRef, useEffect, useState } from 'react';

interface EmotionWheelProps {
  selectedEmotions: string[];
  onEmotionToggle: (emotion: string) => void;
  angerEmotionRef: React.MutableRefObject<(SVGGElement | null)[]>;
  onTabPress: () => void;
  onShiftTabPress: () => void;
}

const EMOTIONS = [
  { name: 'Joy', color: '#FFFF00' },
  { name: 'Trust', color: '#98FB98' },
  { name: 'Fear', color: '#90EE90' },
  { name: 'Surprise', color: '#00FFFF' },
  { name: 'Sadness', color: '#4169E1' },
  { name: 'Disgust', color: '#9370DB' },
  { name: 'Anger', color: '#FF0000' },
  { name: 'Anticipation', color: '#FFA500' },
];

export const EmotionWheel: React.FC<EmotionWheelProps> = ({
  selectedEmotions,
  onEmotionToggle,
  angerEmotionRef,
  onTabPress,
  onShiftTabPress,
}) => {
  const [keyboardFocusedIndex, setKeyboardFocusedIndex] = useState<number | null>(null);
  const [isKeyboardNavigation, setIsKeyboardNavigation] = useState(false);
  const size = 300;
  const center = size / 2;
  const radius = size / 2;
  const emotionRefs = useRef<(SVGGElement | null)[]>([]);
  const wheelRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    emotionRefs.current = emotionRefs.current.slice(0, EMOTIONS.length);
  }, []);

  useEffect(() => {
    const handleWheelFocus = () => {
      if (!isKeyboardNavigation) {
        setIsKeyboardNavigation(true);
        setKeyboardFocusedIndex(0);
        emotionRefs.current[0]?.focus();
      }
    };

    const wheelElement = wheelRef.current;
    wheelElement?.addEventListener('focus', handleWheelFocus);

    return () => {
      wheelElement?.removeEventListener('focus', handleWheelFocus);
    };
  }, [isKeyboardNavigation]);

  const handleKeyDown = (e: React.KeyboardEvent, emotionIndex: number) => {
    setIsKeyboardNavigation(true);
    e.preventDefault();
    switch (e.key) {
      case 'Enter':
      case ' ':
        onEmotionToggle(EMOTIONS[emotionIndex].name);
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        focusEmotion((emotionIndex - 1 + EMOTIONS.length) % EMOTIONS.length);
        break;
      case 'ArrowDown':
      case 'ArrowRight':
        focusEmotion((emotionIndex + 1) % EMOTIONS.length);
        break;
      case 'Tab':
        if (e.shiftKey) {
          onShiftTabPress();
        } else {
          onTabPress();
        }
        setKeyboardFocusedIndex(null);
        setIsKeyboardNavigation(false);
        break;
    }
  };

  const focusEmotion = (index: number) => {
    emotionRefs.current[index]?.focus();
    setKeyboardFocusedIndex(index);
  };

  const handleFocus = (index: number) => {
    if (isKeyboardNavigation) {
      setKeyboardFocusedIndex(index);
    }
  };

  const handleBlur = () => {
    setKeyboardFocusedIndex(null);
    setIsKeyboardNavigation(false);
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="emotion-wheel"
      ref={wheelRef}
      tabIndex={0}
    >
      {EMOTIONS.map((emotion, index) => {
        const startAngle = (index * 45 * Math.PI) / 180;
        const endAngle = ((index + 1) * 45 * Math.PI) / 180;
        const x1 = center + radius * Math.cos(startAngle);
        const y1 = center + radius * Math.sin(startAngle);
        const x2 = center + radius * Math.cos(endAngle);
        const y2 = center + radius * Math.sin(endAngle);

        const largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";

        const pathD = [
          `M ${center},${center}`,
          `L ${x1},${y1}`,
          `A ${radius},${radius} 0 ${largeArcFlag} 1 ${x2},${y2}`,
          "Z"
        ].join(" ");

        const textAngle = (startAngle + endAngle) / 2;
        const textRadius = radius * 0.7;
        const textX = center + textRadius * Math.cos(textAngle);
        const textY = center + textRadius * Math.sin(textAngle);

        return (
          <g
            key={emotion.name}
            onClick={() => onEmotionToggle(emotion.name)}
            ref={(el) => {
              emotionRefs.current[index] = el;
              if (emotion.name === 'Anger') {
                if (el) {
                  angerEmotionRef.current = [el];
                }
              }
            }}
            tabIndex={-1}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onFocus={() => handleFocus(index)}
            onBlur={handleBlur}
          >
            <path
              d={pathD}
              fill={emotion.color}
              stroke="white"
              strokeWidth="1"
              className={`emotion-segment ${selectedEmotions.includes(emotion.name) ? 'selected' : ''} ${keyboardFocusedIndex === index ? 'keyboard-focused' : ''}`}
            />
            <text
              x={textX}
              y={textY}
              textAnchor="middle"
              dominantBaseline="middle"
              className="emotion-name"
            >
              {emotion.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
};