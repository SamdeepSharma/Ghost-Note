import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface TopicData {
  [key: string]: number;
}

interface TopicChartProps {
  data: TopicData;
}

const TopicChart: React.FC<TopicChartProps> = ({ data }) => {
  const topicIcons: { [key: string]: string } = {
    'relationships': '💕',
    'work': '💼',
    'technology': '💻',
    'health': '🏥'
  };

  const sortedTopics = Object.entries(data)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8); // Show top 8 topics

  const total = Object.values(data).reduce((sum, val) => sum + val, 0);

  const getPercentage = (value: number) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  if (sortedTopics.length === 0) {
    return (
      <Card className="bg-white bg-opacity-50">
        <CardHeader>
          <CardTitle>Topic Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            No topics detected in your messages yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white bg-opacity-50">
      <CardHeader>
        <CardTitle>Topic Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedTopics.map(([topic, count]) => (
            <div key={topic} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium flex items-center gap-2">
                  {topicIcons[topic] || '📝'} {topic.charAt(0).toUpperCase() + topic.slice(1)}
                </span>
                <span className="text-sm text-muted-foreground">
                  {count} ({getPercentage(count)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${getPercentage(count)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopicChart; 