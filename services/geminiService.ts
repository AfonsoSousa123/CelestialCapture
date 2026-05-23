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

    return response.text || "No description generated.";
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

        const jsonText = response.text?.trim();
        if (!jsonText) return [];
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

    const jsonText = response.text?.trim();
    if (!jsonText) throw new Error("Empty response");
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

    const jsonText = response.text?.trim();
    if (!jsonText) throw new Error("Empty response");
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error generating Bortle Scale info:", error);
    throw new Error("Could not generate Bortle Scale information at this time.");
  }
};

export const generateWhatsUpTonight = async (latitude: number, longitude: number, locale: string): Promise<any> => {
  const language = locale === 'pt-PT' ? 'Portuguese from Portugal' : 'English';
  const currentDate = new Date().toISOString().split('T')[0];
  const prompt = `You are an expert astronomer providing localized advice. Your entire response MUST be in ${language}.
Based on the user's location (Latitude: ${latitude}, Longitude: ${longitude}) and the current date (${currentDate}), provide the planet visibility and meteor shower calendar for TONIGHT and the upcoming weeks.

Return a JSON object containing:
1. 'planets': An array of objects for major planets (Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune).
   Each planet object needs:
   - 'name': The name of the planet.
   - 'emoji': A relevant emoji (e.g., ♂️, ♃, ♄).
   - 'status': A short status string (e.g., 'Evening Sky', 'Morning Sky', 'Not Visible', 'Difficult to see').
   - 'location': A short descriptive sentence of where and when to look (e.g., 'Brilliant and bright in the south after dusk.').
   
2. 'meteors': An array of up to 5 upcoming or current meteor showers.
   Each meteor shower object needs:
   - 'name': The name of the meteor shower.
   - 'peak': Human readable date string for the peak (e.g., 'Aug 12-13').
   - 'rate': Expected zenithal hourly rate (e.g., '~100/hr').
   - 'moon': A short description of how the moon phase will affect viewing for this peak (e.g., 'Waxing Crescent (Favorable)').

Make sure the information is accurate for the provided latitude, longitude, and current date.
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
            planets: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  emoji: { type: Type.STRING },
                  status: { type: Type.STRING },
                  location: { type: Type.STRING }
                },
                required: ['name', 'emoji', 'status', 'location']
              }
            },
            meteors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  peak: { type: Type.STRING },
                  rate: { type: Type.STRING },
                  moon: { type: Type.STRING }
                },
                required: ['name', 'peak', 'rate', 'moon']
              }
            }
          },
          required: ['planets', 'meteors']
        }
      }
    });

    const jsonText = response.text?.trim();
    if (!jsonText) throw new Error("Empty response");
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error generating What's Up Tonight info:", error);
    throw new Error("Could not generate What's Up Tonight information at this time.");
  }
};

export const generateCelestialEvents = async (locale: string): Promise<any[]> => {
  const language = locale === 'pt-PT' ? 'Portuguese from Portugal' : 'English';
  const currentYear = new Date().getFullYear();
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  // Limit to 5 events to prevent timeout/payload issues
  const prompt = `You are an expert astronomer. Your entire response MUST be in ${language}.
  List 5 major upcoming celestial events starting strictly after today (${today}). Focus on the remainder of ${currentYear} (or early ${currentYear + 1} if few events remain in ${currentYear}). Include significant meteor showers (with peak dates), solar and lunar eclipses (with dates and visibility areas), and notable planetary conjunctions or alignments.
  For each event, provide:
  - 'name': The name of the event.
  - 'date': Human readable date string (e.g. "August 12-13").
  - 'isoDate': The start date in YYYY-MM-DD format (ISO 8601).
  - 'isoEndDate': The end date in YYYY-MM-DD format (ISO 8601). 
    * IMPORTANT: If the event spans multiple days (e.g. "August 12-13"), isoEndDate MUST be the actual last day (e.g. "2024-08-13"). 
    * If it is a single day event, isoEndDate MUST be the same as isoDate.
  - 'startTime': Optional approximate local start time in HH:MM format (24h) if a specific peak time is known (e.g. "22:00"). Leave empty if not applicable.
  - 'endTime': Optional approximate local end time in HH:MM format (24h). Leave empty if not applicable.
  - 'location': The regions where the event is visible (e.g. "North America, Europe"). Leave empty if visible globally or irrelevant.
  - 'description': A brief, exciting description.
  - 'emoji': A single fun and relevant emoji for the event (e.g. ☄️ for meteors, 🌑 for new moon, 🪐 for Saturn, ✨ for general).
  Return the response as a JSON object with a single key 'events' which is an array of objects. ALL string values in the JSON object must be translated into ${language}.
  `;

  let attempt = 0;
  const maxAttempts = 3;

  while (attempt < maxAttempts) {
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
                    isoDate: { type: Type.STRING, description: "Start date of the event in YYYY-MM-DD format (ISO 8601)." },
                    isoEndDate: { type: Type.STRING, description: "End date of the event in YYYY-MM-DD format (ISO 8601). Must be provided explicitly for multi-day events. Must be >= isoDate." },
                    startTime: { type: Type.STRING, description: "Optional start time HH:MM" },
                    endTime: { type: Type.STRING, description: "Optional end time HH:MM" },
                    location: { type: Type.STRING, description: "Visibility region" },
                    description: { type: Type.STRING },
                    emoji: { type: Type.STRING, description: "A single emoji representing the event" }
                  },
                  required: ['name', 'date', 'isoDate', 'isoEndDate', 'description', 'emoji']
                }
              }
            },
            required: ['events']
          }
        }
      });

      const jsonText = response.text?.trim();
      if (!jsonText) throw new Error("Empty response from AI");
      const result = JSON.parse(jsonText);
      return result.events || [];
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed for celestial events:`, error);
      attempt++;
      if (attempt === maxAttempts) {
        // Return empty array instead of throwing to prevent app crash if AI is unavailable
        console.error("Could not generate celestial events after multiple attempts.");
        return [];
      }
      // Exponential backoff with jitter
      const backoffTime = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, backoffTime));
    }
  }
  return [];
};


export const generateChatResponse = async (history: Content[], newMessage: string, systemInstruction: string): Promise<string> => {
    try {
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            history: history,
            config: { systemInstruction }
        });
        const response = await chat.sendMessage({ message: newMessage });
        return response.text || "I'm having trouble connecting to the stars right now.";
    } catch (error) {
        console.error("Error generating chat response:", error);
        return "<p>I seem to be having trouble connecting to the cosmos. Please try again in a moment.</p>";
    }
};