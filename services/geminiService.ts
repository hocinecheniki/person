
import { GoogleGenAI, Type } from "@google/genai";
import { Tutor } from "../types";

export const getTutorRecommendation = async (userPrompt: string, tutors: Tutor[]) => {
  // Fix: Initialize GoogleGenAI inside the function using process.env.API_KEY directly
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const tutorsSummary = tutors.map(t => ({
    id: t.id,
    name: t.name,
    specialty: t.specialty,
    bio: t.bio,
    subjects: t.subjects
  }));

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
      بناءً على طلب الطالب التالي: "${userPrompt}"
      قم باختيار أفضل معلم من القائمة التالية واشرح لماذا هو الأنسب:
      ${JSON.stringify(tutorsSummary)}
      
      يجب أن يكون الرد بصيغة JSON تحتوي على:
      1. tutorId (معرف المعلم المختار)
      2. reasoning (السبب باللغة العربية بأسلوب ودود ومقنع)
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          tutorId: { type: Type.STRING },
          reasoning: { type: Type.STRING }
        },
        required: ["tutorId", "reasoning"]
      }
    }
  });

  try {
    // Fix: Correctly using .text property to extract generated content
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Failed to parse AI response", error);
    return null;
  }
};
