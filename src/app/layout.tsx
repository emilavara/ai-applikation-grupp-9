import type { Metadata } from "next";
import '../styles/main.scss';

export const metadata: Metadata = {
    title: "KajmilGPT",
    description: "skamlös chatgpt-klon av kaj och emil. kajmilgpt. byggd med gemini.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    );
}