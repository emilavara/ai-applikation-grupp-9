# KajmilGPT

KajmilGPT är en AI-driven chattapplikation byggd med **Next.js 15**, och **Googles Gemini 2.5 Flash** via det nya biblioteket [`@google/genai`](https://www.npmjs.com/package/@google/genai).

---

## Funktioner

- **Streamad-respons i realtid** — tack vare Next.js Edge Runtime och Geminis `generateContentStream`.
- **Markdown-rendering** med stöd för kodblock och syntax-highlighting.
- **AI som förstår kontext** och svarar på naturligt språk.
- **Ren och responsiv UI** inspirerad av moderna AI-chattar.
- **Fördefinierade exempelknappar** för snabb interaktion (t.ex. “Hur skriver jag en fetch i JavaScript?”).

---

## Hur den fungerar

1. Användaren skriver en fråga i chattfältet.  
2. Frågan skickas till `/api/gemini`, där vi anropar **Gemini 2.5 Flash**.  
3. AI:et returnerar text **i strömmande form** (chunk för chunk).  
4. Frontend-komponenten tar emot strömmen och uppdaterar texten i realtid.  
5. Resultatet renderas snyggt som Markdown via `React Markdown`, med kodexempel och syntax highlighting via `highlight.js`.

---

## Reflektion

Vi identifierade Googles nya AI-bibliotek `@google/genai`, som ger tillgång till Gemini-modellerna via ett modernt JavaScript-SDK.
Vi tillämpade tekniken genom att bygga en chattfunktion i vår applikation som kan generera och strömma svar i realtid. Användaren skriver en fråga, som skickas till vårt Next.js-API, där Gemini-modellen (gemini-2.5-flash) bearbetar prompten och returnerar texten stegvis. Detta möjliggör en konversationsupplevelse som liknar ChatGPT — direkt integrerad i vår egen miljö.

Vi valde Gemini och @google/genai främst för att:
det är officiellt från Google och därmed stabilt, välunderhållet och framtidssäkert, det stöder Edge Runtime-streaming, vilket gör att svaren kan uppdateras i realtid utan att hela meddelandet behöver laddas in först,
och det har ett enkelt API som fungerar bra i JavaScript-/TypeScript-baserade projekt, vilket passade vår tech-stack.
AI-komponenten behövdes för att skapa en intelligent chattupplevelse där användaren får relevanta, språkförståelsetunga svar.
Utan AI hade vi behövt hårdkoda svar eller bygga upp ett regelbaserat system — vilket hade varit mycket mer begränsat, svårt att underhålla och saknat den naturliga språkförståelsen som Gemini tillför.

Kort sagt:
AI-komponenten gjorde det möjligt att skapa en interaktiv, kontextmedveten chatt som annars hade varit omöjlig eller orimligt tidskrävande att bygga med traditionell logik.