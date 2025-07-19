import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

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

// Simple sentiment analysis using keyword matching
function analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
  const positiveWords = [
    'love', 'great', 'amazing', 'wonderful', 'fantastic', 'awesome', 'beautiful', 
    'happy', 'joy', 'excited', 'perfect', 'brilliant', 'excellent', 'good', 'nice',
    'sweet', 'cute', 'adorable', 'wonderful', 'magical', 'inspiring', 'motivating',
    'positive', 'uplifting', 'cheerful', 'delightful', 'pleased', 'satisfied'
  ];
  
  const negativeWords = [
    'hate', 'terrible', 'awful', 'horrible', 'bad', 'sad', 'angry', 'frustrated',
    'disappointed', 'upset', 'worried', 'scared', 'afraid', 'anxious', 'stressed',
    'depressed', 'lonely', 'hurt', 'pain', 'suffering', 'miserable', 'unhappy',
    'negative', 'disgusting', 'annoying', 'irritating', 'boring', 'tired'
  ];

  const words = text.toLowerCase().split(/\s+/);
  let positiveCount = 0;
  let negativeCount = 0;

  words.forEach(word => {
    if (positiveWords.includes(word)) positiveCount++;
    if (negativeWords.includes(word)) negativeCount++;
  });

  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

// Simple emotion detection
function detectEmotion(text: string): string {
  const emotionKeywords = {
    joy: ['happy', 'joy', 'excited', 'fun', 'laugh', 'smile', 'great', 'wonderful', 'amazing', 'love', 'good', 'nice', 'sweet', 'cute', 'adorable', 'magical', 'inspiring', 'motivating', 'positive', 'uplifting', 'cheerful', 'delightful', 'pleased', 'satisfied', 'awesome', 'fantastic', 'perfect', 'brilliant', 'excellent', 'beautiful', 'wonderful', 'magical', 'inspiring', 'motivating', 'positive', 'uplifting', 'cheerful', 'delightful', 'pleased', 'satisfied'],
    sadness: ['sad', 'cry', 'tears', 'lonely', 'miss', 'depressed', 'blue', 'down', 'hurt', 'pain', 'suffering', 'miserable', 'unhappy', 'negative', 'tired', 'exhausted', 'broken', 'heartbroken', 'disappointed', 'sadness', 'grief', 'sorrow', 'melancholy', 'gloomy', 'hopeless', 'defeated', 'defeated', 'crushed', 'devastated'],
    anger: ['angry', 'mad', 'furious', 'rage', 'hate', 'annoyed', 'irritated', 'frustrated', 'upset', 'disgusted', 'disappointed', 'angry', 'mad', 'furious', 'rage', 'hate', 'annoyed', 'irritated', 'frustrated', 'upset', 'outraged', 'livid', 'enraged', 'hostile', 'aggressive', 'violent', 'bitter', 'resentful'],
    surprise: ['wow', 'omg', 'surprised', 'shocked', 'unexpected', 'amazing', 'incredible', 'unbelievable', 'astonishing', 'stunning', 'mind-blowing', 'wow', 'omg', 'surprised', 'shocked', 'unexpected', 'startled', 'bewildered', 'confused', 'perplexed', 'dumbfounded', 'flabbergasted', 'stunned', 'amazed'],
    fear: ['scared', 'afraid', 'fear', 'worried', 'anxious', 'terrified', 'nervous', 'stressed', 'panicked', 'frightened', 'horrified', 'scared', 'afraid', 'fear', 'worried', 'anxious', 'terrified', 'fearful', 'apprehensive', 'concerned', 'distressed', 'alarmed', 'petrified', 'terrified', 'horrified', 'dread', 'panic'],
    disgust: ['disgusting', 'gross', 'ew', 'yuck', 'nasty', 'revolting', 'sickening', 'repulsive', 'vile', 'filthy', 'disgusting', 'gross', 'ew', 'yuck', 'nasty', 'revolting', 'repugnant', 'abhorrent', 'loathsome', 'detestable', 'contemptible', 'despicable', 'odious', 'abominable']
  };

  const words = text.toLowerCase().split(/\s+/);
  const emotionScores: { [key: string]: number } = {};

  Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
    // Check for exact matches
    const exactMatches = words.filter(word => keywords.includes(word)).length;
    
    // Check for partial matches
    const partialMatches = keywords.filter(keyword => 
      words.some(word => word.includes(keyword) || keyword.includes(word))
    ).length;
    
    emotionScores[emotion] = exactMatches + (partialMatches * 0.5); // Give partial matches half weight
  });

  // Find the emotion with the highest score
  const dominantEmotion = Object.entries(emotionScores).reduce((a, b) => 
    emotionScores[a[0]] > emotionScores[b[0]] ? a : b
  );

  return dominantEmotion[1] > 0 ? dominantEmotion[0] : 'neutral';
}

// Simple topic modeling using keyword extraction
function extractTopics(text: string): string[] {
  const commonTopics = {
    'relationships': ['love', 'dating', 'boyfriend', 'girlfriend', 'marriage', 'relationship', 'romance', 'crush', 'heart', 'kiss', 'hug', 'affection', 'partner', 'spouse', 'divorce', 'breakup', 'single', 'commitment', 'trust', 'loyalty'],
    'work': ['job', 'work', 'career', 'office', 'boss', 'colleague', 'meeting', 'project', 'deadline', 'promotion', 'salary', 'interview', 'resume', 'company', 'business', 'client', 'customer', 'presentation', 'conference', 'workplace', 'team', 'manager', 'employee', 'employer'],
    'technology': ['tech', 'computer', 'phone', 'app', 'software', 'digital', 'internet', 'social', 'media', 'website', 'programming', 'coding', 'developer', 'startup', 'innovation', 'gadget', 'device', 'smartphone', 'laptop', 'tablet', 'ai', 'artificial', 'intelligence', 'machine', 'learning', 'data', 'cloud', 'cybersecurity', 'blockchain', 'crypto', 'bitcoin'],
    'health': ['health', 'fitness', 'exercise', 'diet', 'sick', 'doctor', 'medicine', 'hospital', 'clinic', 'therapy', 'mental', 'physical', 'wellness', 'nutrition', 'vitamins', 'supplements', 'workout', 'gym', 'yoga', 'meditation', 'stress', 'anxiety', 'depression', 'therapy', 'counseling', 'recovery', 'healing', 'symptoms', 'diagnosis', 'treatment']
  };

  const words = text.toLowerCase().split(/\s+/);
  const detectedTopics: string[] = [];

  Object.entries(commonTopics).forEach(([topic, keywords]) => {
    if (keywords.some(keyword => words.includes(keyword))) {
      detectedTopics.push(topic);
    }
  });

  return detectedTopics;
}

// Analyze message timing patterns
function analyzeTiming(messages: any[]): any {
  const hourly: { [key: number]: number } = {};
  const daily: { [key: string]: number } = {};
  const weekly: { [key: string]: number } = {};

  messages.forEach(message => {
    const date = new Date(message.createdAt);
    const hour = date.getHours();
    const day = date.toLocaleDateString('en-US', { weekday: 'long' });
    const week = date.toISOString().slice(0, 10); // YYYY-MM-DD

    hourly[hour] = (hourly[hour] || 0) + 1;
    daily[day] = (daily[day] || 0) + 1;
    weekly[week] = (weekly[week] || 0) + 1;
  });

  const peakHour = Object.entries(hourly).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  const peakDay = Object.entries(daily).reduce((a, b) => a[1] > b[1] ? a : b)[0];

  return { hourly, daily, weekly, peakHour: parseInt(peakHour), peakDay };
}

// Analyze sentiment trends over time
function analyzeSentimentTrends(messages: any[]): any {
  const sentimentByDate: { [key: string]: { positive: number; negative: number; neutral: number } } = {};

  messages.forEach(message => {
    const date = new Date(message.createdAt).toISOString().slice(0, 10);
    const sentiment = analyzeSentiment(message.content);

    if (!sentimentByDate[date]) {
      sentimentByDate[date] = { positive: 0, negative: 0, neutral: 0 };
    }

    sentimentByDate[date][sentiment]++;
  });

  const trends = Object.entries(sentimentByDate).map(([date, counts]) => ({
    date,
    ...counts
  })).sort((a, b) => a.date.localeCompare(b.date));

  return trends;
}

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated!"
      }, { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const foundUser = await UserModel.aggregate([
      { $match: { _id: userId } },
      {
        $addFields: {
          messages: {
            $cond: {
              if: { $eq: [{ $type: "$messages" }, "array"] },
              then: { $ifNull: ["$messages", []] },
              else: []
            }
          }
        }
      }
    ]);

    if (!foundUser || foundUser.length === 0) {
      return Response.json(
        {
          success: false,
          message: "User not found."
        }, { status: 404 }
      );
    }

    const messages = foundUser[0].messages;
    
    if (messages.length === 0) {
      return Response.json(
        {
          success: true,
          message: "No messages to analyze.",
          analytics: {
            sentiment: { positive: 0, negative: 0, neutral: 0, overall: 'neutral' },
            emotions: { joy: 0, sadness: 0, anger: 0, surprise: 0, fear: 0, disgust: 0, dominant: 'neutral' },
            topics: {},
            timing: { hourly: {}, daily: {}, weekly: {}, peakHour: 0, peakDay: 'No data' },
            trends: { sentimentOverTime: [] },
            summary: { totalMessages: 0, averageLength: 0, questionRatio: 0, exclamationRatio: 0 }
          }
        }, { status: 200 }
      );
    }

    // Analyze sentiment
    const sentimentCounts = { positive: 0, negative: 0, neutral: 0 };
    const emotionCounts = { joy: 0, sadness: 0, anger: 0, surprise: 0, fear: 0, disgust: 0 };
    const topicCounts: { [key: string]: number } = {};
    let totalLength = 0;
    let questionCount = 0;
    let exclamationCount = 0;

    messages.forEach((message: { content: string; createdAt: string }) => {
      const sentiment = analyzeSentiment(message.content);
      const emotion = detectEmotion(message.content);
      const topics = extractTopics(message.content);

      sentimentCounts[sentiment]++;
      if (emotion !== 'neutral') {
        emotionCounts[emotion as keyof typeof emotionCounts]++;
      }

      topics.forEach(topic => {
        topicCounts[topic] = (topicCounts[topic] || 0) + 1;
      });

      totalLength += message.content.length;
      if (message.content.includes('?')) questionCount++;
      if (message.content.includes('!')) exclamationCount++;
    });

    const overallSentiment = Object.entries(sentimentCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0] as 'positive' | 'negative' | 'neutral';
    const dominantEmotion = Object.entries(emotionCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0] || 'neutral';

    // Analyze timing
    const timing = analyzeTiming(messages);

    // Analyze trends
    const trends = analyzeSentimentTrends(messages);

    const analytics: MessageAnalytics = {
      sentiment: {
        ...sentimentCounts,
        overall: overallSentiment
      },
      emotions: {
        ...emotionCounts,
        dominant: dominantEmotion
      },
      topics: topicCounts,
      timing,
      trends: {
        sentimentOverTime: trends
      },
      summary: {
        totalMessages: messages.length,
        averageLength: Math.round(totalLength / messages.length),
        questionRatio: Math.round((questionCount / messages.length) * 100),
        exclamationRatio: Math.round((exclamationCount / messages.length) * 100)
      }
    };

    return Response.json(
      {
        success: true,
        message: "Analytics generated successfully.",
        analytics
      }, { status: 200 }
    );

  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Error generating analytics."
      }, { status: 500 }
    );
  }
} 