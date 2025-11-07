import { GoogleGenAI, Type } from "@google/genai";
import { Contact, GiftRecommendation, Relationship } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  // This is a fallback for development. In a real environment, the key should be set.
  console.warn("API_KEY environment variable not set. Using a placeholder which will likely fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const giftRecommendationSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      itemName: {
        type: Type.STRING,
        description: 'The specific name of the recommended gift item in Korean.',
      },
      category: {
        type: Type.STRING,
        description: 'A general category for the gift (e.g., Electronics, Fashion, Hobby-related) in Korean.',
      },
      reason: {
        type: Type.STRING,
        description: "A brief explanation in Korean of why this gift is a good recommendation for the person, based on their profile.",
      },
    },
    required: ['itemName', 'category', 'reason'],
  },
};

const contactExtractionSchema = {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: 'The full name of the person in Korean.' },
      affiliation: { type: Type.STRING, description: 'The company or organization name in Korean.' },
      interests: {
        type: Type.ARRAY,
        description: 'A list of inferred interests or keywords based on the card, in Korean (e.g., job title, industry).',
        items: { type: Type.STRING }
      },
    },
    required: ['name', 'affiliation']
  };

export const getGiftRecommendations = async (contact: Contact, budget: number): Promise<GiftRecommendation[]> => {
  const model = "gemini-2.5-flash";
  const upcomingEvent = getUpcomingEvent(contact);

  const prompt = `
    다음은 제 연락처에 있는 사람의 정보입니다. 이 사람에게 줄 선물을 추천해주세요.

    ### 연락처 정보
    - **이름**: ${contact.name}
    - **관계**: ${contact.relationship}
    - **소속**: ${contact.affiliation}
    - **관심사 및 취미**: ${contact.interests.join(', ')}
    ${contact.allergies ? `- **알러지 정보**: ${contact.allergies.join(', ')}` : ''}
    ${upcomingEvent ? `- **다가오는 기념일**: ${upcomingEvent}` : ''}
    - **과거 선물 기록**: ${contact.giftHistory.length > 0 ? contact.giftHistory.map(g => g.gift).join(', ') : '없음'}
    - **나의 예산**: ${budget.toLocaleString()}원

    이 정보를 바탕으로, 예산에 맞는 3가지 선물을 추천해주세요. 각 선물에 대해 구체적인 아이템 이름, 카테고리, 그리고 이 사람에게 왜 좋은 선물인지 추천 이유를 간략하게 설명해주세요.
    과거에 선물했던 아이템은 제외하고, 창의적이고 사려 깊은 추천을 부탁합니다.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: giftRecommendationSchema,
        temperature: 0.8,
      }
    });
    
    const jsonText = response.text.trim();
    const recommendations = JSON.parse(jsonText);
    
    if (!Array.isArray(recommendations)) {
        throw new Error("Invalid response format from API.");
    }
    
    return recommendations;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to fetch gift recommendations from Gemini API.");
  }
};

export const extractContactFromImage = async (base64ImageData: string): Promise<Partial<Contact>> => {
    const model = "gemini-2.5-flash";
    const prompt = `
      제공된 명함 이미지를 분석해주세요.
      여기서 이름, 소속(회사 또는 단체), 그리고 직책이나 산업 분야를 기반으로 추론한 관심사를 추출하여 JSON 객체로 반환해주세요.
      모든 텍스트는 한국어로 작성해야 합니다.
      정보를 찾을 수 없는 경우, 해당 키는 JSON 객체에서 생략해주세요.
    `;

    const imagePart = {
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64ImageData,
        },
    };

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: { parts: [imagePart, { text: prompt }] },
            config: {
                responseMimeType: "application/json",
                responseSchema: contactExtractionSchema,
            }
        });

        const jsonText = response.text.trim();
        const extractedData = JSON.parse(jsonText);

        return {
            ...extractedData,
            relationship: Relationship.Business, // Default relationship
        };

    } catch (error) {
        console.error("Error extracting contact from image:", error);
        throw new Error("Failed to extract contact information from the image.");
    }
};


const getUpcomingEvent = (contact: Contact): string | null => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkDate = (dateStr?: string, eventName?: string) => {
        if (!dateStr || !eventName) return null;
        const eventDate = new Date(dateStr);
        eventDate.setFullYear(today.getFullYear());
        const diffTime = eventDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays >= 0 && diffDays <= 30) { // Look ahead 30 days
            return `${eventName} (${eventDate.getMonth() + 1}월 ${eventDate.getDate()}일)`;
        }
        return null;
    }

    return checkDate(contact.importantDates.birthday, "생일") ||
           checkDate(contact.importantDates.promotionDate, "승진일") ||
           checkDate(contact.importantDates.weddingAnniversary, "결혼기념일");
}