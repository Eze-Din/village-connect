
import { GoogleGenAI } from "@google/genai";

// A mock API key is used here as we can't rely on `process.env`.
// In a real application, this should be handled securely.
const API_KEY = "AIzaSyBG8GF6hARmDn0sM_u0WZaMesPpdeFfiRk"; // This would be process.env.API_KEY in a real setup

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const draftContent = async (basePrompt: string): Promise<string> => {
  if (API_KEY === "AIzaSyBG8GF6hARmDn0sM_u0WZaMesPpdeFfiRk") {
    console.warn("Gemini API key is not set. Returning mock data.");
    return new Promise(resolve => setTimeout(() => resolve(`This is a mock AI-generated response for the prompt: "${basePrompt}". Please set up your Gemini API key in services/geminiService.ts to get real responses.`), 1000));
  }
  
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
    return "Error generating content. Please check your API key and network connection, then try again.";
  }
};
