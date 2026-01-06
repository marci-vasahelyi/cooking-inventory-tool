import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

const PROMPT_TEMPLATE = `
You are a creative and expert kitchen AI assistant. 
Based on the following list of ingredients available in the user's kitchen, suggest 3 creative and delicious recipes they can make. 
For each recipe, provide:
1. A catchy name.
2. A brief description of why it's a good choice.
3. A list of main ingredients used from the inventory.
4. Any common pantry staples they might need (like salt, oil, water).

Return the response in a structured JSON format:
{
  "suggestions": [
    {
      "name": "Recipe Name",
      "description": "Short description",
      "ingredientsUsed": ["ingredient1", "ingredient2"],
      "pantryStaples": ["staple1", "staple2"]
    }
  ]
}
`;

async function tryGemini(inventory: string[]) {
    if (!GEMINI_API_KEY) {
        console.error("Gemini API key is missing");
        return null;
    }
    try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
        const prompt = `${PROMPT_TEMPLATE}\n\nInventory:\n${inventory.join(', ')}`;
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        // Clean up JSON if model adds markdown blocks
        const jsonStr = text.replace(/```json|```/g, "").trim();
        return JSON.parse(jsonStr);
    } catch (e) {
        console.error("Gemini failed, falling back...", e);
        return null;
    }
}

async function tryGroq(inventory: string[]) {
    if (!GROQ_API_KEY) {
        console.error("Groq API key is missing");
        return null;
    }
    try {
        const res = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: PROMPT_TEMPLATE },
                    { role: "user", content: `Inventory:\n${inventory.join(", ")}` },
                ],
                response_format: { type: "json_object" },
            },
            {
                headers: {
                    Authorization: `Bearer ${GROQ_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );
        const content = res.data.choices[0].message.content;
        return content ? JSON.parse(content) : null;
    } catch (e) {
        console.error("Groq fallback failed too.", e);
        return null;
    }
}

export async function getRecipeSuggestions(inventory: string[]) {
    if (inventory.length === 0) {
        return { suggestions: [] };
    }

    let result = await tryGemini(inventory);
    if (!result) {
        console.log("Gemini failed or returned empty, trying Groq fallback...");
        result = await tryGroq(inventory);
    }

    return result || { suggestions: [] };
}
