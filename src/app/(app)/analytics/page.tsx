'use client'
import React, { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/components/ui/use-toast';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Loader2, BarChart3, TrendingUp, Clock, MessageSquare, Heart, Brain, Hash, ArrowLeft } from 'lucide-react';
import AnalyticsCard from '@/components/AnalyticsCard';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SentimentChart from '@/components/SentimentChart';
import EmotionChart from '@/components/EmotionChart';
import TopicChart from '@/components/TopicChart';
import TimingChart from '@/components/TimingChart';

interface MessageAnalytics {
  sentiment: {
    positive: number;
    negative: number;
    neutral: number;
    overall: 'positive' | 'negative' | 'neutral';
  };
  emotions: {
    joy: number;
    sadness: number;
    anger: number;
    surprise: number;
    fear: number;
    disgust: number;
    dominant: string;
  };
  topics: {
    [key: string]: number;
  };
  timing: {
    hourly: { [key: number]: number };
    daily: { [key: string]: number };
    weekly: { [key: string]: number };
    peakHour: number;
    peakDay: string;
  };
  trends: {
    sentimentOverTime: Array<{
      date: string;
      positive: number;
      negative: number;
      neutral: number;
    }>;
  };
  summary: {
    totalMessages: number;
    averageLength: number;
    questionRatio: number;
    exclamationRatio: number;
  };
}

const AnalyticsPage = () => {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [analytics, setAnalytics] = useState<MessageAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get<ApiResponse & { analytics: MessageAnalytics }>('/api/message-analytics');
      if (response.data.success) {
        setAnalytics(response.data.analytics);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message || 'Failed to fetch analytics',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (session) {
      fetchAnalytics();
    }
  }, [session, fetchAnalytics]);

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100 flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-stone-900 mb-4">Message Analytics</h1>
          <p className="text-stone-600">Please sign in to view your message analytics.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100 flex items-center justify-center p-6">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-stone-600 mx-auto mb-4" />
          <span className="text-stone-600">Loading analytics...</span>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100 flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-stone-900 mb-4">Message Analytics</h1>
          <p className="text-stone-600">No analytics data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-stone-800 to-stone-600 bg-clip-text text-transparent mb-2">
                Message Analytics
              </h1>
              <p className="text-stone-600">
                Insights about your anonymous messages
              </p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline" className="flex items-center gap-2 border-stone-300 text-stone-700 hover:bg-stone-50">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <AnalyticsCard
          title="Total Messages"
          value={analytics.summary.totalMessages}
          icon={<MessageSquare className="h-4 w-4" />}
          subtitle="Messages received"
        />
        <AnalyticsCard
          title="Average Length"
          value={`${analytics.summary.averageLength} chars`}
          icon={<BarChart3 className="h-4 w-4" />}
          subtitle="Per message"
        />
        <AnalyticsCard
          title="Questions"
          value={`${analytics.summary.questionRatio}%`}
          icon={<Hash className="h-4 w-4" />}
          subtitle="Of all messages"
        />
        <AnalyticsCard
          title="Exclamations"
          value={`${analytics.summary.exclamationRatio}%`}
          icon={<TrendingUp className="h-4 w-4" />}
          subtitle="Of all messages"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <SentimentChart data={analytics.sentiment} />
        <EmotionChart data={analytics.emotions} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <TopicChart data={analytics.topics} />
        <TimingChart data={analytics.timing} />
      </div>

      {/* Sentiment Trends */}
      {analytics.trends.sentimentOverTime.length > 0 && (
        <div className="mb-8">
          <Card className="border-stone-200 bg-white/70 backdrop-blur-sm shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-stone-900">Sentiment Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.trends.sentimentOverTime.slice(-7).map((trend, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                    <span className="text-sm font-medium text-stone-700">
                      {new Date(trend.date).toLocaleDateString()}
                    </span>
                    <div className="flex gap-4">
                      <span className="text-sm text-green-600 font-medium">😊 {trend.positive}</span>
                      <span className="text-sm text-red-600 font-medium">😔 {trend.negative}</span>
                      <span className="text-sm text-stone-600 font-medium">😐 {trend.neutral}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Insights */}
      <div className="bg-white bg-opacity-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">Overall Mood:</span> Your messages are mostly{' '}
              <span className={`font-semibold ${
                analytics.sentiment.overall === 'positive' ? 'text-green-600' :
                analytics.sentiment.overall === 'negative' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {analytics.sentiment.overall}
              </span>
            </p>
            <p className="text-sm">
              <span className="font-medium">Dominant Emotion:</span> {analytics.emotions.dominant}
            </p>
            <p className="text-sm">
              <span className="font-medium">Peak Activity:</span> {analytics.timing.peakDay} at{' '}
              {analytics.timing.peakHour === 0 ? '12 AM' : 
               analytics.timing.peakHour < 12 ? `${analytics.timing.peakHour} AM` :
               analytics.timing.peakHour === 12 ? '12 PM' : `${analytics.timing.peakHour - 12} PM`}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">Most Active Topic:</span>{' '}
              {Object.entries(analytics.topics).sort(([,a], [,b]) => b - a)[0]?.[0] || 'None detected'}
            </p>
            <p className="text-sm">
              <span className="font-medium">Message Style:</span>{' '}
              {analytics.summary.questionRatio > 20 ? 'Question-heavy' :
               analytics.summary.exclamationRatio > 20 ? 'Expressive' : 'Balanced'}
            </p>
            <p className="text-sm">
              <span className="font-medium">Engagement Level:</span>{' '}
              {analytics.summary.totalMessages > 50 ? 'High' :
               analytics.summary.totalMessages > 20 ? 'Medium' : 'Low'}
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default AnalyticsPage; 