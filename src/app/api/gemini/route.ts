import { NextRequest } from "next/server";
import { GoogleGenAI } from "@google/genai";

//the edge runtime is required to make streaming work properly, without this reponses are buffered until complete (i.e. no live updates)
export const runtime = "edge";

//init gemini client
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();
        if (!prompt) {
            return new Response("Missing prompt", { status: 400 });
        }
        
        //ask gemini to generate the content as a stream rather than one big blob
        //this allows us to progressively display them on the client
        const responseStream = await ai.models.generateContentStream({
            model: "gemini-2.5-flash",
            contents: [{ role: "user", parts: [{ text: prompt }] }],
        });
        
        //convert the gemini async generator into a standard web ReadableStream, which browsers can consume progressively
        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();
                
                try {
                    //loop through each chunk of text async as gemini sends it
                    for await (const chunk of responseStream) {
                        if (chunk.text) {
                            //encode text, push it to the response stream
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
        
        //return the stream as a STREAMING http response
        return new Response(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Cache-Control": "no-cache", //prevents bad caching, ensures that data is indeed live
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
