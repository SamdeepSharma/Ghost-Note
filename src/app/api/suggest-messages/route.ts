import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

export async function POST(request: Request) {

  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform and suitable for a diverse audience. For example, your output should be structured like this: 'Have you ever went on a date? || If you could have dinner with any historical figure, who would it be? || What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, lovely, lively, little crazy and contribute to a positive and welcoming conversational environment. Your questions can be a little catchy which makes the user to really ask it up. Your response can be fun and not too formal but in limits. Your each question can be of at most 20 words. Also remember to change the topic of each question whenever a new response is made. Don't use escape sequences as a part of your response.";

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const suggestions = text.trim().replace(/^"|"$/g, '');
    return Response.json(
      { suggestions }, { status: 200 }
    )
  } catch (error) {
    console.log("Internal server error", error)
    return Response.json(
      { message: "Internal server error." }, { status: 500 }
    )
  }
}