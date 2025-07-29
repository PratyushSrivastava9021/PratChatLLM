// In src/config/gemini.js
import {
    GoogleGenerativeAI, 
    HarmCategory,
    HarmBlockThreshold,
} from "@google/generative-ai";


const MODEL_NAME = 'gemini-1.5-flash'; 


const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;


if (!API_KEY) {
    console.error("VITE_GEMINI_API_KEY is not defined in your .env file!");
    
    throw new Error("API Key not found. Please set VITE_GEMINI_API_KEY in your .env file.");
}

async function runChat(prompt) {
    if (!prompt || prompt.trim() === "") {
        console.warn("Prompt is empty!");
        return "Please enter a valid message.";
    }

    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });

        const generationConfig = {
            temperature: 0.9,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
        };

        const safetySettings = [
            {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
        ];
        const result = await model.generateContent({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig,
            safetySettings,
        });

        const response = result.response;
        console.log("Gemini Response:", response.text());

        return response.text();

    } catch (error) {
        console.error("Error calling Gemini API:", error);

        return "Something went wrong while contacting AI. Please try again.";
    }
}

export default runChat;