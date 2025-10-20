"use client"

import { useState, useRef, FormEvent } from "react"
import { ArrowUpIcon } from "@phosphor-icons/react/dist/ssr";

export default function Chat() {
    const [prompt, setPrompt] = useState("");
	const [isFetching, setIsFetching] = useState(false)
	const [chatlog, setChatlog] = useState<{ text: string; class: string }[]>([])
	const promptInput = useRef<HTMLInputElement>(null);
    
    return (
        <div className="kajmilgpt-chat-wrapper">
            <div className="kajmilgpt-chat-container">
                
            </div>
            <div className="kajmilgpt-input-wrapper">
                <div className="kajmilgpt-input-container">
                    <input type="text" placeholder="Vad kan KajmilGPT hjälpa till med idag?"/>
                    <button className="model-button">gemini-2.5-flash</button>
                    <button className="submit-button">
                        <ArrowUpIcon size={18} weight={"bold"} color={"white"}/>
                    </button>
                </div>
            </div>
        </div>
    )
}