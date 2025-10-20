import { NextRequest } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const runtime = "edge"; // ✅ required for streaming to work properly

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();
        if (!prompt) {
            return new Response("Missing prompt", { status: 400 });
        }

        const responseStream = await ai.models.generateContentStream({
            model: "gemini-2.5-flash",
            contents: [{ role: "user", parts: [{ text: prompt }] }],
        });

        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();

                try {
                    for await (const chunk of responseStream) {
                        if (chunk.text) {
                            controller.enqueue(encoder.encode(chunk.text));
                        }
                    }
                } catch (err) {
                    console.error("Stream error:", err);
                    controller.enqueue(encoder.encode("[Stream error]"));
                } finally {
                    controller.close();
                }
            },
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Cache-Control": "no-cache",
            },
        });
    } catch (error) {
        console.error("Gemini API error:", error);
        return new Response(
            '{"error": "Failed to stream from Gemini API"}',
            { status: 500 }
        );
    }
}
