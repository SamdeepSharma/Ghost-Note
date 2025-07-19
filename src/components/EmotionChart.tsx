import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface EmotionData {
  joy: number;
  sadness: number;
  anger: number;
  surprise: number;
  fear: number;
  disgust: number;
  dominant: string;
}

interface EmotionChartProps {
  data: EmotionData;
}

const EmotionChart: React.FC<EmotionChartProps> = ({ data }) => {
  const emotions = [
    { key: 'joy', label: 'Joy', emoji: '😊', color: 'bg-yellow-400' },
    { key: 'sadness', label: 'Sadness', emoji: '😢', color: 'bg-blue-400' },
    { key: 'anger', label: 'Anger', emoji: '😠', color: 'bg-red-400' },
    { key: 'surprise', label: 'Surprise', emoji: '😲', color: 'bg-purple-400' },
    { key: 'fear', label: 'Fear', emoji: '😨', color: 'bg-gray-400' },
    { key: 'disgust', label: 'Disgust', emoji: '🤢', color: 'bg-green-400' }
  ];

  const total = Object.values(data).reduce((sum, val) => sum + (typeof val === 'number' ? val : 0), 0);

  const getPercentage = (value: number) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  return (
    <Card className="bg-white bg-opacity-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Emotion Detection</span>
          <span className="text-sm font-normal text-muted-foreground">
            Dominant: {emotions.find(e => e.key === data.dominant)?.emoji || '😐'} {data.dominant}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {emotions.map(({ key, label, emoji, color }) => {
            const value = data[key as keyof EmotionData] as number;
            return (
              <div key={key} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium flex items-center gap-1">
                    {emoji} {label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {value} ({getPercentage(value)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${color} transition-all duration-300`}
                    style={{ width: `${getPercentage(value)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionChart; 