import * as fs from "fs";
import { GoogleGenAI } from "@google/genai";

// This API key is from Gemini Developer API Key, not vertex AI API Key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function summarizeMeetingTranscript(transcript: string): Promise<{
  summary: string;
  actionItems: string[];
  title: string;
}> {
  try {
    const systemPrompt = `You are a meeting analysis expert. 
Analyze the meeting transcript and provide:
1. A concise summary (2-3 sentences)
2. Action items extracted from the transcript
3. A short, descriptive title for the meeting

Respond with JSON in this exact format:
{
  "summary": "Brief meeting summary",
  "actionItems": ["Action item 1", "Action item 2"],
  "title": "Meeting Title"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            summary: { type: "string" },
            actionItems: { type: "array", items: { type: "string" } },
            title: { type: "string" },
          },
          required: ["summary", "actionItems", "title"],
        },
      },
      contents: transcript,
    });

    const rawJson = response.text;
    console.log(`Meeting Analysis Response: ${rawJson}`);

    if (rawJson) {
      const data = JSON.parse(rawJson);
      return {
        summary: data.summary || "Meeting summary unavailable",
        actionItems: data.actionItems || [],
        title: data.title || "Meeting"
      };
    } else {
      throw new Error("Empty response from model");
    }
  } catch (error) {
    console.error("Failed to analyze meeting:", error);
    return {
      summary: "Unable to generate summary",
      actionItems: [],
      title: "Meeting"
    };
  }
}

export async function answerQuestionWithContext(
  question: string,
  transcripts: string[],
  documents: string[] = []
): Promise<string> {
  try {
    const context = [
      ...transcripts.map(t => `Meeting Transcript:\n${t}`),
      ...documents.map(d => `Document:\n${d}`)
    ].join('\n\n---\n\n');

    const prompt = `Based on the following meeting transcripts and documents, answer this question: ${question}

Context:
${context}

Please provide a helpful and accurate answer based only on the information provided in the context.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "I couldn't find relevant information to answer your question.";
  } catch (error) {
    console.error("Failed to answer question:", error);
    return "I'm sorry, I encountered an error while processing your question.";
  }
}

export async function analyzeDocument(content: string): Promise<string> {
  try {
    const prompt = `Analyze this document and provide a brief summary of its key points and main topics:

${content}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "Document analysis unavailable";
  } catch (error) {
    console.error("Failed to analyze document:", error);
    return "Unable to analyze document";
  }
}