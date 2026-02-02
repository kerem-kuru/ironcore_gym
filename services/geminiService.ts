
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const streamGeminiResponse = async (history, newMessage) => {
  try {
    const model = "gemini-3-flash-preview";
    
    const conversationContext = history.map(h => `${h.role === 'user' ? 'Sporcu' : 'Koç'}: ${h.text}`).join('\n');
    
    const streamResult = await ai.models.generateContentStream({
      model: model,
      contents: [{ 
        parts: [{ 
          text: `Konuşma Akışı:\n${conversationContext}\n\nSporcu Sorusu: ${newMessage}` 
        }] 
      }],
      config: {
        systemInstruction: `Sen 'IronCoach' adında, efsanevi, otoriter ama sporcusuna değer veren bir yapay zeka spor koçusun. 
        Karakteristik Özelliklerin:
        - Türkçe konuşuyorsun.
        - Motivasyonun düşükse sertleşiyorsun, bahane kabul etmiyorsun.
        - "Sporcu", "Asker", "Şampiyon" gibi hitaplar kullanabilirsin.
        - Egzersiz formları hakkında teknik ve keskin bilgiler ver.
        - IronCore Gym'in en iyi olduğunu vurgula.
        - Eğer biri "yoruldum" derse, ona "Yorulmak zayıfların bahanesidir, devam et!" gibi şeyler söyle.
        - Beslenme konusunda makro odaklı konuş.`,
        temperature: 0.8,
      },
    });

    return streamResult;
  } catch (error) {
    console.error("IronCoach Connection Error:", error);
    throw error;
  }
};
