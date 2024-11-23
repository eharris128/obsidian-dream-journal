interface EmotionWheelProps {
  selectedEmotions: string[];
  onEmotionToggle: (emotion: string) => void;
  angerEmotionRef: React.RefObject<SVGGElement>;
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
  const size = 300;
  const center = size / 2;
  const radius = size / 2;

  const handleKeyDown = (e: React.KeyboardEvent, emotion: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onEmotionToggle(emotion);
    } else if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      onTabPress();
    } else if (e.key === 'Tab' && e.shiftKey) {
      e.preventDefault();
      onShiftTabPress();
    }
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="emotion-wheel">
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

        // Use the ref for the Anger emotion
        const ref = emotion.name === 'Anger' ? angerEmotionRef : undefined;

        return (
          <g
            key={emotion.name}
            onClick={() => onEmotionToggle(emotion.name)}
            ref={ref}
            tabIndex={0}
            onKeyDown={(e) => handleKeyDown(e, emotion.name)}  // Use the new handleKeyDown function
          >
            <path
              d={pathD}
              fill={emotion.color}
              stroke="white"
              strokeWidth="1"
              className={`emotion-segment ${selectedEmotions.includes(emotion.name) ? 'selected' : ''}`}
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