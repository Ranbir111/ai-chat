import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { json } from "stream/consumers";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

export async function POST(req: NextRequest) {
    try {
        const { message } = await req.json();

        const response = await ai.models.generateContentStream({
            model: "gemini-1.5-flash",
            contents: message,
            config: {
                systemInstruction: "You are a Software Engineer. Your name is Ranbir.",
            }
        });

        const encoder = new TextEncoder();
        const readable = new ReadableStream({
            async start(controller) {
                for await (const chunk of response) {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk.text })}`));
                }
                controller.close();
            }
        })

        return new Response(readable,{
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive"
            }
        });
    }
    catch (error) {
        console.error("Error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}