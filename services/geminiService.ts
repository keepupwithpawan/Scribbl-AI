import { GoogleGenAI, Type } from "@google/genai";
import type { DigitalNotesData, PhysicalNotesData } from '../types';

// This is a MOCK transcript. To guarantee the correct demo behavior, 
// we will always return the DBMS transcript.
const MOCK_DBMS_TRANSCRIPT_HINDI_ENGLISH = `
(0:01) Namaste dosto, aaj hum DBMS, yaani Database Management System, ke baare mein baat karenge. Yeh ek software hai jo database ko create aur manage karne mein help karta hai.
(0:25) Sabse important concept hai 'ACID properties'. ACID stands for Atomicity, Consistency, Isolation, and Durability. Chalo inko ek-ek karke samjhein.
(1:00) Atomicity ka matlab hai ki transaction ya toh poori hogi, ya bilkul nahi. 'All or nothing'. Jaise bank transfer, ya toh paise poore transfer honge, ya transaction fail ho jayegi.
(1:45) Consistency ensures ki har transaction database ko ek valid state se doosre valid state mein le jaati hai. Koi bhi data integrity constraints violate nahi hone chahiye.
(2:30) Isolation property ka matlab hai ki multiple transactions ek saath ho sakti hain without interfering with each other. Har transaction ko lagta hai ki woh system mein akeli chal rahi hai.
(3:15) Aur aakhir mein, Durability. Iska matlab hai ki jab ek transaction successfully commit ho jaati hai, toh woh changes permanent hote hain. System crash hone par bhi data loss nahi hoga.
(4:00) Normalization ek aur critical topic hai. Yeh process data redundancy ko kam karne aur data integrity ko improve karne ke liye use hota hai. Iske different forms hain, jaise 1NF, 2NF, 3NF.
(4:45) For example, 1NF (First Normal Form) kehta hai ki har table cell mein single value honi chahiye. Koi repeating groups nahi.
(5:20) Toh yeh the kuch basic but very important DBMS concepts. Inko aache se samajhna bohot zaroori hai. Thank you.
`;


const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = "gemini-2.5-flash";

export const getYoutubeTranscriptMock = async (url: string): Promise<string> => {
    console.log(`Fetching transcript for ${url}... (mocked, always returning DBMS content)`);
    // To guarantee the correct demo behavior, we will always return the DBMS transcript.
    return MOCK_DBMS_TRANSCRIPT_HINDI_ENGLISH;
};

const digitalNotesSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: 'A concise, engaging title for the lecture notes.' },
        summary: { type: Type.STRING, description: 'A 2-3 paragraph summary of the entire lecture.' },
        keyTopics: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    topicTitle: { type: Type.STRING },
                    content: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                type: { type: Type.STRING, description: '"bullet", "paragraph", or "image_idea"' },
                                point: { type: Type.STRING, nullable: true },
                                text: { type: Type.STRING, nullable: true },
                                description: { type: Type.STRING, nullable: true }
                            }
                        }
                    }
                }
            }
        },
        chartsAndGraphs: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    type: { type: Type.STRING, description: '"flowchart" or "bar_chart"' },
                    data: { type: Type.ANY, description: 'For flowchart: An array of strings representing steps. For bar_chart: an array of objects like {label: string, value: number}.'},
                    description: { type: Type.STRING }
                }
            }
        },
        practiceQuestions: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING },
                    type: { type: Type.STRING }
                }
            }
        }
    },
    required: ["title", "summary", "keyTopics", "chartsAndGraphs", "practiceQuestions"]
};

const physicalNotesSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: 'A clear and simple title for the notes.' },
        mainSummary: { type: Type.STRING, description: 'A brief, 1-2 sentence summary.' },
        sections: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    heading: { type: Type.STRING },
                    points: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    },
                    diagramIdea: {
                        type: Type.OBJECT,
                        nullable: true,
                        properties: {
                            title: { type: Type.STRING },
                            description: { type: Type.STRING }
                        }
                    }
                }
            }
        }
    },
    required: ["title", "mainSummary", "sections"]
};


export const generateDigitalNotes = async (transcript: string): Promise<DigitalNotesData> => {
    const prompt = `You are an expert academic assistant creating visually-rich study notes from a lecture transcript.
The transcript may be in a mixed language (e.g., Hindi/English). IMPORTANT: Your entire output and all generated text MUST be exclusively in English.

Generate structured notes in JSON format based on the provided schema.
- Identify 3-4 main topics.
- For each topic, create a mix of bullet points and paragraphs.
- Include at least two relevant "image_idea" content blocks within the topics. The description for each image idea must be a detailed visual prompt suitable for an image generation AI.
- Generate at least one "flowchart" and one "bar_chart" in the "chartsAndGraphs" section.
  - For "flowchart", the "data" field must be an array of strings representing the steps.
  - For "bar_chart", the "data" field must be an array of objects, each with a "label" (string) and "value" (number).
- Generate 3-5 practice questions.

Transcript:
---
${transcript}
---`;
    
    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: digitalNotesSchema,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as DigitalNotesData;
    } catch (error) {
        console.error("Error generating digital notes:", error);
        throw new Error("Failed to generate digital notes. Please try again.");
    }
};

export const generatePhysicalNotesLayout = async (transcript: string): Promise<PhysicalNotesData> => {
    const prompt = `You are an expert note-taker creating a layout for handwritten notes from a lecture transcript. The output must be JSON. Keep text concise for easy writing. Use bullet points extensively. Diagram ideas must be extremely simple, using basic shapes (boxes, circles, arrows). The transcript may be in a different language, but your output must be in English.

Transcript:
---
${transcript}
---`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: physicalNotesSchema,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as PhysicalNotesData;
    } catch (error) {
        console.error("Error generating physical notes:", error);
        throw new Error("Failed to generate physical notes layout. Please try again.");
    }
};

export const generateImageFromPrompt = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: `A minimalist, clean, educational illustration for a digital notebook. Style: simple lines, pastel colors, clear subject. Prompt: ${prompt}`,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/png',
              aspectRatio: '4:3',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/png;base64,${base64ImageBytes}`;
        }
        throw new Error("No image was generated.");
    } catch(error) {
        console.error("Error generating image:", error);
        // Return a placeholder or re-throw to be handled by the caller
        throw new Error("Failed to generate image.");
    }
};