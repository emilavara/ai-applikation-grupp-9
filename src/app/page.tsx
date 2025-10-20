"use client"

import Sidebar from "@/components/Sidebar"
import Chat from "@/components/Chat"

import { GrainsIcon } from "@phosphor-icons/react"

export default function Home() {
    return (
        <>
            <header>
                <div className="logo"><GrainsIcon size={24} weight="duotone" color={"orange"} />KajmilGPT</div>
                <div className="button-container">
                    <button className="mock-button">Logga in</button>
                    <button className="mock-button primary">Skapa konto</button>
                </div>
            </header>
            <Chat/>
        </>
    )
}