import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

export async function POST(request: Request) {
  // Check if API key is available
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  if (!apiKey) {
    return Response.json(
      { message: "API key not configured." }, { status: 500 }
    );
  }

  try {
    const prompt = `You are a creative message generator for an anonymous social messaging platform called "Ghost Note". Your task is to create 3 engaging, thought-provoking, and conversation-starting questions that users can send anonymously to others.

CONTEXT:
- This is for an anonymous messaging platform where people send messages to others
- Users want to start meaningful conversations without revealing their identity
- The platform promotes positive, respectful, and engaging interactions
- Messages should be suitable for a diverse, global audience

REQUIREMENTS:
- Create exactly 3 questions separated by '||'
- Each question should be 15-25 words maximum
- Questions should be open-ended and encourage thoughtful responses
- Mix of different themes: personal reflection, hypothetical scenarios, life experiences, creativity, humor, and deep thinking
- Avoid overly personal, controversial, or inappropriate topics
- Make questions intriguing and conversation-worthy
- Use a friendly, casual tone that feels approachable

THEMES TO INCLUDE (one per question):
1. Personal reflection or self-discovery
2. Hypothetical scenario or "what if" question
3. Creative thinking or imagination

EXAMPLES OF GOOD QUESTIONS:
- "If you could have dinner with any fictional character, who would it be and why?"
- "What's a small moment from today that made you smile?"
- "If your life had a soundtrack, what song would be playing right now?"

OUTPUT FORMAT:
Return only the 3 questions separated by '||' with no additional text, quotes, or formatting.

Generate fresh, creative questions that haven't been used before. Make them engaging enough that someone would want to respond to them.`;

    const result = await model.generateContent(prompt);
    
    const response = result.response;
    const text = response.text();
    
    const suggestions = text.trim().replace(/^"|"$/g, '');
    
    const suggestionArray = suggestions.split('||');
    
    return Response.json(
      { suggestions }, { status: 200 }
    )
  } catch (error) {
    return Response.json(
      { message: "Internal server error." }, { status: 500 }
    )
  }
}