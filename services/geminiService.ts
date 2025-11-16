import { GoogleGenAI } from "@google/genai";
import type { DigitalNotesData, PhysicalNotesData } from '../types';

/**
 * Validates a YouTube video URL, including standard, shortened, and live stream links.
 * @param url The YouTube video URL.
 * @returns true if the URL is a valid YouTube video link, false otherwise.
 */
export const isValidYoutubeUrl = (url: string): boolean => {
    const youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com\/(?:watch\?v=|live\/)|youtu\.be\/)([\w-]{11})(?:\S*)?$/;
    return youtubeRegex.test(url);
};

/**
 * Extracts a JSON object from a string, which might be wrapped in markdown.
 * @param text The string to extract JSON from.
 * @returns The clean JSON string.
 */
const extractJsonFromString = (text: string): string => {
    const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
    const match = text.match(jsonRegex);
    if (match && match[1]) {
        return match[1];
    }
    return text.trim();
};


const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = "gemini-2.5-flash";


export const generateDigitalNotes = async (videoUrl: string): Promise<DigitalNotesData> => {
    const prompt = `You are an expert academic assistant. Your task is to generate structured study notes from a YouTube lecture.
Your response MUST be a valid JSON object. Do not include any text, explanation, or markdown formatting like \`\`\`json before or after the JSON object.

Using your built-in search capabilities, analyze the content of the YouTube video at the following URL: ${videoUrl}

Generate the JSON object based on the following structure:
- title: A concise, engaging title for the lecture notes.
- summary: A 2-3 paragraph summary of the entire lecture.
- keyTopics: An array of 3-4 main topics. Each topic object should have:
  - topicTitle: The title of the topic.
  - content: An array of content items, which can be of type "bullet" (with a "point" string), "paragraph" (with a "text" string), or "image_idea" (with a "description" string suitable for an image generation AI). Include at least two "image_idea" blocks.
- chartsAndGraphs: An array of at least one "flowchart" and one "bar_chart". Each chart object should have:
  - title: The chart's title.
  - type: "flowchart" or "bar_chart".
  - data: For a flowchart, an array of strings representing the steps. For a bar_chart, an array of {label: string, value: number} objects.
  - description: A brief description of the chart.
- practiceQuestions: An array of 3-5 practice question objects, each with a "question" string and a "type" string.

IMPORTANT: If you are unable to access the video's content or generate notes for any reason, you MUST return the following JSON object and nothing else: {"error": true, "errorMessage": "Failed to access or process the video content."}
Your entire output and all generated text within the JSON MUST be exclusively in English.
`;
    
    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                tools: [{googleSearch: {}}],
            },
        });
        const rawText = response.text;
        const jsonText = extractJsonFromString(rawText);
        const parsedData = JSON.parse(jsonText);

        if (parsedData.error) {
            throw new Error(parsedData.errorMessage || "The AI model failed to process the video. It may be private or have restrictions.");
        }

        return parsedData as DigitalNotesData;
    } catch (error) {
        console.error("Error generating digital notes:", error);
        if (error instanceof SyntaxError) {
             throw new Error("The AI returned an invalid response. The video might be private, very new, or have other restrictions. Please try a different URL.");
        }
        throw new Error("Failed to generate digital notes. The video content might be inaccessible or the topic too complex. Please try a different video.");
    }
};

export const generatePhysicalNotesLayout = async (videoUrl: string): Promise<PhysicalNotesData> => {
    const prompt = `You are an expert note-taker. Your task is to create a layout for handwritten notes from a YouTube lecture.
Your response MUST be a valid JSON object. Do not include any text, explanation, or markdown formatting like \`\`\`json before or after the JSON object.

Keep text concise for easy writing. Use bullet points extensively. Diagram ideas must be extremely simple, using basic shapes (boxes, circles, arrows).

Using your built-in search capabilities, analyze the content of the YouTube video at the following URL: ${videoUrl}

Generate the JSON object based on the following structure:
- title: A clear and simple title for the notes.
- mainSummary: A brief, 1-2 sentence summary.
- sections: An array of section objects. Each section should have:
  - heading: The section heading.
  - points: An array of strings for bullet points.
  - diagramIdea: (Optional) An object with a "title" and a "description" for a simple drawing.

IMPORTANT: If you are unable to access the video's content or generate notes for any reason, you MUST return the following JSON object and nothing else: {"error": true, "errorMessage": "Failed to access or process the video content."}
Your entire output and all generated text within the JSON MUST be exclusively in English.
`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                tools: [{googleSearch: {}}],
            },
        });
        const rawText = response.text;
        const jsonText = extractJsonFromString(rawText);
        const parsedData = JSON.parse(jsonText);
        
        if (parsedData.error) {
            throw new Error(parsedData.errorMessage || "The AI model failed to process the video. It may be private or have restrictions.");
        }

        return parsedData as PhysicalNotesData;
    } catch (error) {
        console.error("Error generating physical notes:", error);
        if (error instanceof SyntaxError) {
             throw new Error("The AI returned an invalid response. The video might be private, very new, or have other restrictions. Please try a different URL.");
        }
        throw new Error("Failed to generate physical notes layout. The video content might be inaccessible. Please try again.");
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