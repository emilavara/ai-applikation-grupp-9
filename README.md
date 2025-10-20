# KajmilGPT

KajmilGPT är en AI-driven chattapplikation byggd med **Next.js 15 och TypeScript**, och **Googles Gemini 2.5 Flash** via Googles [`@google/genai`](https://www.npmjs.com/package/@google/genai)-bibliotek.

## Funktioner

- **Streamad-respons i realtid** — tack vare Next.js Edge Runtime och Geminis `generateContentStream`.
- **Markdown-rendering** med stöd för kodblock och syntax-highlighting.
- **AI som förstår kontext** och svarar på naturligt språk.
- **Ren och responsiv UI** inspirerad av moderna AI-chattar.
- **Fördefinierade exempelknappar** för snabb interaktion (t.ex. “Hur skriver jag en fetch i JavaScript?”).

## Hur den fungerar

1. Användaren skriver en fråga i chattfältet.  
2. Frågan skickas till `/api/gemini`, där vi anropar **Gemini 2.5 Flash**.  
3. AI:et returnerar text **i strömmande form** (alltså chunk för chunk).  
4. Frontend-komponenten tar emot strömmen och uppdaterar texten i realtid.  
5. Resultatet renderas snyggt som Markdown via `React Markdown`, med kodexempel och syntax highlighting via `highlight.js`.

## Reflektion

Vi använde oss utav Googles Gemini för att bygga denna ChatGPT-liknande wrapper. Vi använde deras `@google/genai`-SDK för att göra ett API.
Vi tillämpade tekniken genom att bygga en chattfunktion i vår applikation som kan generera och streama svar i realtid. Användaren skriver en fråga, som skickas till vårt Next.js-API, där Gemini-modellen (gemini-2.5-flash i detta fall) bearbetar prompten och returnerar texten chunk för chunk. Detta möjliggör en konversationsupplevelse som liknar ChatGPT, fast direkt integrerad i vår, _nästan_, helt egna mijlö.

Vi valde Gemini och `@google/genai` främst för att:
det är officiellt från Google och därmed någorlunda stabilt, välunderhållet och framtidssäkert. Det stöder Edge Runtime-streaming, vilket gör att svaren kan streamas i realtid utan att hela meddelandet behöver laddas in först,
och det har ett enkelt API som fungerar bra i TypeScript-baserade projekt, vilket passade vår tech-stack. Google har också en väldigt generös gratis-plan för deras Gemini API:er.    

AI-komponenten behövdes för att skapa en intelligent chattupplevelse där användaren får relevanta, språkförståelsetunga svar. AI:n är central i hela applikationen här. Utan den, hade KajmilGPT inte funkat överhuvudtaget. Utan AI-komponenten hade vi fått skriva alla tänkbara frågor, och alla tänkbara svar, vilket inte är realistiskt alls. AI-komponenten gjorde det helt enkelt möjligt att skapa en interaktiv chatt som annars hade varit **omöjlig** att bygga med traditionell logik.
