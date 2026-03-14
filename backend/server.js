/**
 * Chat backend for the Expo chatbot app with Gemini API integration
 */

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();

// Allow requests from Expo / browser
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Gemini API key from .env
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Initialize Gemini if key exists
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

/**
 * Function to get AI reply
 */
async function getBotReply(prompt) {
  if (!genAI) {
    // No API key → mock reply
    return `This is a mock reply: ${prompt}`;
  }

  try {
    // Use a Free tier-compatible model
    const model = genAI.getGenerativeModel({
      model: "text-bison-001" // <--- works with Free tier key
    });

    const result = await model.generateContent(prompt);
    return result.response.text();

  } catch (error) {
    console.error("Gemini API error:", error);
    // fallback to mock reply if Gemini fails
    return `Mock reply due to Gemini API error: ${prompt}`;
  }
}

/**
 * Chat API endpoint
 */
app.post("/chat", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({
        success: false,
        error: "Invalid prompt"
      });
    }

    const reply = await getBotReply(prompt.trim());

    res.json({
      success: true,
      reply
    });

  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server error"
    });
  }
});

/**
 * Start server
 */
app.listen(PORT, () => {
  console.log(`Chat server running on http://localhost:${PORT}`);

  if (!GEMINI_API_KEY) {
    console.log("Using MOCK replies (add GEMINI_API_KEY in .env for real Gemini).");
  } else {
    console.log("Gemini API connected. Using model: text-bison-001");
  }
});