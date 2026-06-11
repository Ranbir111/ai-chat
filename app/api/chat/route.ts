import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

export async function POST(req: NextRequest) {
    try {
        const { message } = await req.json();

        const response = await ai.models.generateContent({
            model: process.env.GEMINI_API_MODEL!,
            contents: message,
        });
        return NextResponse.json({ response: response.text });
    }
    catch (error) {
        console.error("Error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}

export const GET = async (req: NextRequest) => {
    try {
        return NextResponse.json({ message: "Hello from GET" });
    }
    catch (error) {
        console.error("Error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}