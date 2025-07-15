
import { GoogleGenAI } from "@google/genai";

// This service assumes `process.env.API_KEY` is set in the environment.
// The API key must be provided as an environment variable for security and correctness.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const draftContent = async (basePrompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: basePrompt,
      config: {
          systemInstruction: "You are a helpful assistant for a village administrator. Your tone should be clear, professional, and friendly. Generate content based on the user's request, formatted appropriately for an official announcement or document.",
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error drafting content with Gemini:", error);
    return "There was an error generating content. The API key might be missing or invalid. Please check the setup and try again.";
  }
};
