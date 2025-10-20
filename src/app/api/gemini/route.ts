import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const API_KEY = process.env.GOOGLE_API_KEY;
if (!API_KEY) {
  throw new Error('Missing GOOGLE_API_KEY env var');
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    const text = result.text;
    return NextResponse.json({ response: text });
  } catch (error: any) {
    console.error('Gemini API Error:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch response from Gemini API' },
      { status: 500 }
    );
  }
}
