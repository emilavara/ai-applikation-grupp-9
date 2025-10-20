"use client"

import { useState, useRef, FormEvent } from "react"
import { ArrowUpIcon } from "@phosphor-icons/react/dist/ssr";

import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

export default function Chat() {
    const [prompt, setPrompt] = useState("");
	const [isFetching, setIsFetching] = useState(false)
	const [chatlog, setChatlog] = useState<{ text: string; class: string }[]>([])
	const promptInput = useRef<HTMLInputElement>(null);
	
	async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        setIsFetching(true)
        
        let promptToAdd = {
            text: prompt,
            class: 'chat-input'
        }
        
        setChatlog(prevChatlog => [...prevChatlog, promptToAdd])
        
        //reset input field
        if (promptInput.current) {
            promptInput.current.value = "";
        }
        
        try {
            const res = await fetch("/api/gemini", {
               	method: "POST",
               	headers: { "Content-Type": "application/json" },
               	body: JSON.stringify({ prompt }),
            });
            
            if (!res.ok) {
               	throw new Error('Failed to submit the data. Please try again.')
            } else {
                const data = await res.json()
                
                let responseToAdd = {
                   	text: data.response,
                   	class: 'chat-output',
                   	markdown: data.response
                }
                
                setChatlog(prevChatlog => [...prevChatlog, responseToAdd])
                setIsFetching(false)
                
                setTimeout(() => {
                   	hljs.initHighlighting();
                }, 1)
            }
            
        } catch (error) {
            console.error(error)
        }
    }
    
    return (
        <div className="kajmilgpt-chat-wrapper">
            <div className="kajmilgpt-chat-container">
                {chatlog.map(chat => (
					<div key={chat.text} className={chat.class}>
					    {chat.text}
					</div>
				))}
            </div>
            <div className="kajmilgpt-input-wrapper">
                <form onSubmit={handleSubmit} className="kajmilgpt-input-container">
                    <input onChange={(e) => setPrompt(e.target.value)} ref={promptInput} type="text" placeholder="Vad kan KajmilGPT hjälpa till med idag?"/>
                    <button className="model-button">gemini-2.5-flash</button>
                    <button type="submit" className="submit-button">
                        <ArrowUpIcon size={18} weight={"bold"} color={"white"}/>
                    </button>
                </form>
            </div>
        </div>
    )
}