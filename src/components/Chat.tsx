"use client";

//react stuff
import { useState, useRef } from "react";

//react markdown stuff
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'

//highlight.js stuff
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";

//components and icons
import Loader from "@/components/Loader"
import { ArrowUpIcon, StopIcon } from "@phosphor-icons/react/dist/ssr";
import { GrainsIcon } from "@phosphor-icons/react/dist/ssr";

export default function Chat() {
    const [prompt, setPrompt] = useState("");
    const [isFetching, setIsFetching] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [chatlog, setChatlog] = useState<{ text: string; class: string }[]>([]);
    const promptInput = useRef<HTMLInputElement>(null);

    async function handleSubmit(e?: React.FormEvent, customPrompt?: string) {
        e?.preventDefault();
        const inputPrompt = customPrompt ?? prompt;
        
        //trim whitespaces for safety
        if (!inputPrompt.trim()) return;
        
        //render prompt chat bubble
        setChatlog(prev => [...prev, { text: inputPrompt, class: "chat-input" }]);
        
        //clear input
        if (promptInput.current) promptInput.current.value = "";
    
        setPrompt("");
        setIsFetching(true);
        setShowLoader(true);
    
        try {
            //send prompt to gemini
            const res = await fetch("/api/gemini", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: inputPrompt }),
            });
    
            if (!res.ok || !res.body) throw new Error("No response stream from Gemini API");
            
            //check for response stream from gemini
            const reader = res.body.getReader();
            const decoder = new TextDecoder();
    
            let fullText = "";
            
            //add initial chat bubble, this gets filled up as we recieve chunks from gemini
            setChatlog(prev => [...prev, { text: "", class: "chat-output" }]);
    
            let firstChunk = true;
            
            //render each chunk continuously
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
    
                const chunk = decoder.decode(value, { stream: true });
                fullText += chunk;
                
                //remove loader when first chunk is recieved
                if (firstChunk) {
                    setShowLoader(false);
                    firstChunk = false;
                }
                
                //update chatlog object
                setChatlog(prev => {
                    const updated = [...prev];
                    const last = updated[updated.length - 1];
                    if (last && last.class === "chat-output") {
                        last.text = fullText;
                    }
                    return [...updated];
                });
            }
            
            //set global fetching to false
            setIsFetching(false);
            
            //add syntax highlighting
            setTimeout(() => hljs.highlightAll(), 100);
        } catch (err) {
            console.error("Error fetching Gemini response:", err);
            setIsFetching(false);
        }
    }
    
    async function exampleChatHandler(type: string) {
        if (type === "fetch") {
            handleSubmit(undefined, "Hur skriver jag en fetch i JavaScript?");
        }
        if (type === "center") {
            handleSubmit(undefined, "Hur centrerar jag en div?");
        }
        if (type === "sky") {
            handleSubmit(undefined, "Vad har himlen för färg?");
        }
    }

    return (
        <div className="kajmilgpt-chat-wrapper">
            <div className={`kajmilgpt-chat-container ${chatlog.length === 0 ? 'welcome-screen' : ''}`}>
                {chatlog.length === 0 ? 
                    <div className="welcome-screen">
                        <h1>Välkommen till <GrainsIcon size={32} weight="duotone" color={"orange"} />KajmilGPT.</h1>
                        <p>Fråga mig vad som helst.</p>
                    </div> 
                : ''}
                
                {chatlog.map((chat, i) => (
                    <div key={i} className={chat.class}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{chat.text}</ReactMarkdown>
                    </div>
                ))}
                
                {showLoader ? <Loader></Loader> : ''}
            </div>

            <div className={`kajmilgpt-input-wrapper ${chatlog.length === 0 ? 'has-question-buttons' : ''}`}>
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
                <button onClick={() => exampleChatHandler('fetch')} className="question-button" type="button">
                    Hur skriver jag en fetch i JavaScript?
                </button>
                <button onClick={() => exampleChatHandler('center')} className="question-button" type="button">
                    Hur centrerar jag en div?
                </button>
                <button onClick={() => exampleChatHandler('sky')} className="question-button" type="button">
                    Vad har himlen för färg?  
                </button>
            </div>
        </div>
    );
}