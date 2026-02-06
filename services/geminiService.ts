import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { Market } from "../types";

export const analyzeMarket = async (market: Market): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please set REACT_APP_GEMINI_API_KEY.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Construct a prompt with the latest market data
  const prompt = `
    Analyze the following OTC market data and provide a trading signal:
    
    Market: ${market.name}
    Current Price: ${market.price}
    24h Change: ${market.changePercent}%
    RSI (14): ${market.rsi}
    MACD: ${market.macd}
    Volatility: ${market.volatility}
    Recent Trend: ${market.changePercent > 0 ? "Uptrend" : market.changePercent < 0 ? "Downtrend" : "Sideways"}
    
    Based on this data, is this a good time to enter? Use your strategies defined in the system instructions.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, // Balanced creativity and logic
      }
    });

    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating analysis. Please check your API key and connection.";
  }
};
