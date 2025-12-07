import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GeminiBookingResponse } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to convert Blob to Base64
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const bookingSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    service: {
      type: Type.STRING,
      description: "The type of service requested (e.g., 'snerydning', 'havearbejde', 'tømrer', 'rengøring'). Normalize to Danish lowercase.",
    },
    date: {
      type: Type.STRING,
      description: "The requested date or time for the booking expressed as a string (e.g., 'next Friday', 'tomorrow').",
    },
    name: {
        type: Type.STRING,
        description: "The name of the person booking if mentioned."
    },
    summary: {
      type: Type.STRING,
      description: "A very short, polite summary of what was understood in Danish.",
    },
  },
  required: ["summary"],
};

export const analyzeVoiceBooking = async (audioBlob: Blob): Promise<GeminiBookingResponse> => {
  if (!apiKey) {
    console.error("API Key missing");
    return { summary: "API Key mangler. Tjek konfiguration." };
  }

  try {
    const base64Audio = await blobToBase64(audioBlob);

    const model = 'gemini-2.5-flash';
    
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: audioBlob.type || 'audio/webm',
              data: base64Audio
            }
          },
          {
            text: "Listen to this audio booking request for a property service company. Extract the service type, date, and customer name if present. Return JSON."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: bookingSchema,
        systemInstruction: "You are a helpful AI assistant for Lyth Ejendomsservice. Your job is to extract booking details from Danish audio."
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    return JSON.parse(text) as GeminiBookingResponse;

  } catch (error) {
    console.error("Gemini Error:", error);
    return { summary: "Kunne ikke forstå beskeden. Prøv venligst igen." };
  }
};