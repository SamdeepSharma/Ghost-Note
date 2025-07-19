import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface SentimentData {
  positive: number;
  negative: number;
  neutral: number;
  overall: 'positive' | 'negative' | 'neutral';
}

interface SentimentChartProps {
  data: SentimentData;
}

const SentimentChart: React.FC<SentimentChartProps> = ({ data }) => {
  const total = data.positive + data.negative + data.neutral;
  
  const getPercentage = (value: number) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  const getColor = (type: 'positive' | 'negative' | 'neutral') => {
    switch (type) {
      case 'positive': return 'bg-green-500';
      case 'negative': return 'bg-red-500';
      case 'neutral': return 'bg-gray-500';
    }
  };

  const getEmoji = (type: 'positive' | 'negative' | 'neutral') => {
    switch (type) {
      case 'positive': return '😊';
      case 'negative': return '😔';
      case 'neutral': return '😐';
    }
  };

  return (
    <Card className="bg-white bg-opacity-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Sentiment Analysis</span>
          <span className="text-sm font-normal text-muted-foreground">
            Overall: {getEmoji(data.overall)} {data.overall}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            { type: 'positive' as const, label: 'Positive', value: data.positive },
            { type: 'negative' as const, label: 'Negative', value: data.negative },
            { type: 'neutral' as const, label: 'Neutral', value: data.neutral }
          ].map(({ type, label, value }) => (
            <div key={type} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium flex items-center gap-2">
                  {getEmoji(type)} {label}
                </span>
                <span className="text-sm text-muted-foreground">
                  {value} ({getPercentage(value)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getColor(type)} transition-all duration-300`}
                  style={{ width: `${getPercentage(value)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SentimentChart; 