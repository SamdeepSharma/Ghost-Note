import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface TimingData {
  hourly: { [key: number]: number };
  daily: { [key: string]: number };
  weekly: { [key: string]: number };
  peakHour: number;
  peakDay: string;
}

interface TimingChartProps {
  data: TimingData;
}

const TimingChart: React.FC<TimingChartProps> = ({ data }) => {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  const getDayName = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  const getHourLabel = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  };

  const maxHourly = Math.max(...Object.values(data.hourly));
  const maxDaily = Math.max(...Object.values(data.daily));

  return (
    <div className="space-y-6">
      {/* Daily Pattern */}
      <Card className="bg-white bg-opacity-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Daily Message Pattern</span>
            <span className="text-sm font-normal text-muted-foreground">
              Peak: {getDayName(data.peakDay)}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {daysOfWeek.map(day => {
              const count = data.daily[day] || 0;
              const height = maxDaily > 0 ? (count / maxDaily) * 100 : 0;
              return (
                <div key={day} className="space-y-1">
                  <div className="text-xs text-center text-muted-foreground">
                    {day.slice(0, 3)}
                  </div>
                  <div className="relative h-20 bg-gray-200 rounded">
                    <div
                      className="absolute bottom-0 w-full bg-blue-500 rounded transition-all duration-300"
                      style={{ height: `${height}%` }}
                    />
                    <div className="absolute inset-0 flex items-end justify-center pb-1">
                      <span className="text-xs font-medium text-white">
                        {count}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Hourly Pattern */}
      <Card className="bg-white bg-opacity-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Hourly Message Pattern</span>
            <span className="text-sm font-normal text-muted-foreground">
              Peak: {getHourLabel(data.peakHour)}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-12 gap-1">
            {Array.from({ length: 24 }, (_, hour) => {
              const count = data.hourly[hour] || 0;
              const height = maxHourly > 0 ? (count / maxHourly) * 100 : 0;
              return (
                <div key={hour} className="space-y-1">
                  <div className="text-xs text-center text-muted-foreground">
                    {hour % 6 === 0 ? getHourLabel(hour) : ''}
                  </div>
                  <div className="relative h-16 bg-gray-200 rounded">
                    <div
                      className="absolute bottom-0 w-full bg-green-500 rounded transition-all duration-300"
                      style={{ height: `${height}%` }}
                    />
                    <div className="absolute inset-0 flex items-end justify-center pb-1">
                      <span className="text-xs font-medium text-white">
                        {count}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimingChart; 