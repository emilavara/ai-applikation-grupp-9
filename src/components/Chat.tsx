"use client";

import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import { ArrowUpIcon, StopIcon } from "@phosphor-icons/react/dist/ssr";
import Loader from "@/components/Loader"

export default function Chat() {
    const [prompt, setPrompt] = useState("");
    const [isFetching, setIsFetching] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [chatlog, setChatlog] = useState<{ text: string; class: string }[]>([]);
    const promptInput = useRef<HTMLInputElement>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!prompt.trim()) return;

        setChatlog(prev => [...prev, { text: prompt, class: "chat-input" }]);
        const currentPrompt = prompt;
        setPrompt("");
        if (promptInput.current) promptInput.current.value = "";

        setIsFetching(true);
        setShowLoader(true)

        try {
            const res = await fetch("/api/gemini", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: currentPrompt }),
            });

            if (!res.ok || !res.body) {
                throw new Error("No response stream from Gemini API");
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder();

            let fullText = "";
            setChatlog(prev => [...prev, { text: "", class: "chat-output" }]);
            
            let firstChunk = true;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                fullText += chunk;
                
                if (firstChunk) {
                    setShowLoader(false);
                    firstChunk = false;
                }

                setChatlog(prev => {
                    const updated = [...prev];
                    const last = updated[updated.length - 1];
                    if (last && last.class === "chat-output") {
                        last.text = fullText;
                    }
                    return [...updated];
                });
                
            }

            setIsFetching(false);

            // highlight code blocks once response is done
            setTimeout(() => hljs.highlightAll(), 100);
        } catch (err) {
            console.error("Error fetching Gemini response:", err);
            setIsFetching(false);
        }
    }

    return (
        <div className="kajmilgpt-chat-wrapper">
            <div className="kajmilgpt-chat-container">
                {chatlog.map((chat, i) => (
                    <div key={i} className={chat.class}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{chat.text}</ReactMarkdown>
                    </div>
                ))}
                {showLoader ? <Loader></Loader> : ''}
            </div>

            <div className="kajmilgpt-input-wrapper">
                <form onSubmit={handleSubmit} className="kajmilgpt-input-container">
                    <input
                        onChange={(e) => setPrompt(e.target.value)}
                        ref={promptInput}
                        type="text"
                        placeholder="Vad kan KajmilGPT hjälpa till med idag?"
                    />  
                    <button className="model-button" type="button">
                        gemini-2.5-flash
                    </button>
                    <button type="submit" className="submit-button">
                        {isFetching ? <StopIcon size={18} weight={"fill"} color={"white"}/> : <ArrowUpIcon size={18} weight={"bold"} color={"white"} />}
                    </button>
                </form>
            </div>
        </div>
    );
}
