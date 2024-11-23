interface EmotionWheelProps {
  selectedEmotions: string[];
  onEmotionToggle: (emotion: string) => void;
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

export const EmotionWheel: React.FC<EmotionWheelProps> = ({ selectedEmotions, onEmotionToggle }) => {
  const size = 300;
  const center = size / 2;
  const radius = size / 2;

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

        return (
          <g key={emotion.name} onClick={() => onEmotionToggle(emotion.name)}>
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