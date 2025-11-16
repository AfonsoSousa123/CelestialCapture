import { GoogleGenAI, Type, Content } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generatePhotoDescription = async (base64Data: string, mimeType: string, prompt: string): Promise<string> => {
  try {
    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType,
      },
    };
    
    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
    });

    return response.text;
  } catch (error) {
    console.error("Error generating photo description:", error);
    return "Could not generate a description at this time. The cosmos remains mysterious.";
  }
};

export const generateBlogIdeas = async (prompt: string): Promise<string[]> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        ideas: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING
                            }
                        }
                    }
                }
            }
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        return result.ideas || [];

    } catch (error) {
        console.error("Error generating blog ideas:", error);
        return ["Error: Could not brainstorm ideas. Try again later."];
    }
};

export const generateMilkyWayGuide = async (latitude: number, longitude: number, locale: string): Promise<any> => {
  const language = locale === 'pt-PT' ? 'Portuguese from Portugal' : 'English';
  const prompt = `You are an expert astronomer providing localized advice. Your entire response MUST be in ${language}.
Based on the user's location (Latitude: ${latitude}, Longitude: ${longitude}), generate a guide for viewing the Milky Way's Galactic Center.
First, determine the user's hemisphere (Northern or Southern) and tailor the advice accordingly.
Provide a concise introductory paragraph about Milky Way visibility from their location.
Then, detail the seasonal visibility in four distinct phases: 'Prime Time', 'Early Season', 'Late Season', and 'Off-Season'. For each season, provide the relevant months and a short, helpful description.
Finally, list three universal key conditions for optimal viewing. Use these exact titles: 'New Moon Phase', 'Dark Skies', and 'Clear Weather'. Provide a relevant emoji icon ('🌑', '🏙️', '☀️' respectively) for each, and a concise description.
Return the response as a JSON object. ALL string values in the JSON object must be translated into ${language}.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            intro: { type: Type.STRING },
            seasonalVisibilityTitle: { type: Type.STRING },
            seasons: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  months: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ['title', 'months', 'description']
              }
            },
            keyConditionsTitle: { type: Type.STRING },
            conditions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  icon: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ['icon', 'title', 'description']
              }
            }
          },
          required: ['intro', 'seasonalVisibilityTitle', 'seasons', 'keyConditionsTitle', 'conditions']
        }
      }
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error generating Milky Way guide:", error);
    throw new Error("Could not generate a Milky Way guide at this time.");
  }
};

export const generateBortleScaleInfo = async (latitude: number, longitude: number, locale: string): Promise<any> => {
  const language = locale === 'pt-PT' ? 'Portuguese from Portugal' : 'English';
  const prompt = `You are an astronomy expert specializing in sky quality and light pollution. Your entire response MUST be in ${language}.
Based on the user's coordinates (Latitude: ${latitude}, Longitude: ${longitude}), estimate the Bortle Scale class.
Return a JSON object containing:
1.  'class': An integer from 1 to 9 representing the estimated Bortle Scale class.
2.  'name': The descriptive name for that class (e.g., 'Rural Sky', 'Inner-city sky').
3.  'description': A detailed paragraph explaining what is typically visible from a location with this Bortle class. Mention naked-eye visibility of the Milky Way, key constellations, and some deep-sky objects.
ALL string values in the JSON object must be translated into ${language}.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            class: { type: Type.INTEGER },
            name: { type: Type.STRING },
            description: { type: Type.STRING }
          },
          required: ['class', 'name', 'description']
        }
      }
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error generating Bortle Scale info:", error);
    throw new Error("Could not generate Bortle Scale information at this time.");
  }
};

export const generateCelestialEvents = async (locale: string): Promise<any[]> => {
  const language = locale === 'pt-PT' ? 'Portuguese from Portugal' : 'English';
  const currentYear = new Date().getFullYear();
  const prompt = `You are an expert astronomer. Your entire response MUST be in ${language}.
  List the major celestial events for the current year (${currentYear}). Include significant meteor showers (with peak dates), solar and lunar eclipses (with dates and visibility areas), and notable planetary conjunctions or alignments.
  For each event, provide a name, a date or date range, and a brief, exciting description.
  Return the response as a JSON object with a single key 'events' which is an array of objects. ALL string values in the JSON object must be translated into ${language}.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            events: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  date: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ['name', 'date', 'description']
              }
            }
          },
          required: ['events']
        }
      }
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    return result.events || [];
  } catch (error) {
    console.error("Error generating celestial events:", error);
    throw new Error("Could not generate celestial events at this time.");
  }
};


export const generateChatResponse = async (history: Content[], newMessage: string, systemInstruction: string): Promise<string> => {
    try {
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            history: history,
            config: { systemInstruction }
        });
        const response = await chat.sendMessage({ message: newMessage });
        return response.text;
    } catch (error) {
        console.error("Error generating chat response:", error);
        return "<p>I seem to be having trouble connecting to the cosmos. Please try again in a moment.</p>";
    }
};