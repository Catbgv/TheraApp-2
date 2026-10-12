# TheraApp — Project Guide for Claude Code

## Project Overview
TheraApp is a mental wellness and structured self-reflection web application grounded in Cognitive Behavioral Therapy (CBT) principles and the ABC formulation (Activating event, Beliefs/thoughts, Consequences/emotions & actions).

### Key Features
1. **Structured ABC Reflection Journal**: 4-step form (Event, Thoughts, Emotions with intensity ratings, Actions/Reactions) with immediate persistence into the Archive.
2. **The Archive**: LocalStorage-persisted archive of all submitted reflections, reframed perspectives, and CBT action plans, with export options (JSON / Markdown).
3. **Paced Breath Work**: Clean paced breathing tool (inhale, hold, exhale, pause) for autonomic regulation.
4. **Cognitive Distortions Guide**: Socratic breakdown of the 10 common cognitive distortions with clue words and reframing protocols.
5. **Bilingual Localization (EN & ES)**: Complete English (default) and Spanish translations powered by `src/i18n.tsx` and the `LanguageToggle` component (US Flag for EN, Spanish Flag for ES).
6. **Socratic AI Reflection Coach**: Optional interactive dialogue utilizing `@google/genai` (Express backend via `server.ts`) with robust client-side resilient fallbacks.

---

## Tech Stack
- **Framework**: React 19 (TypeScript)
- **Bundler / Dev Server**: Vite 8 + tsx (`server.ts` Express server mounting Vite middleware in dev)
- **Styling**: Tailwind CSS v4 (`@import "tailwindcss";` in `src/index.css`)
- **Icons**: Lucide React
- **Typography**: Fraunces (Serif headers) + Plus Jakarta Sans (Sans UI)
- **Persistence**: Browser LocalStorage (`thera_takeaways_v1`, `thera_unsubmitted_draft_v1`, etc.)

---

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (serves on http://localhost:3000)
npm run dev

# Type check / Lint
npm run lint

# Build for production (outputs to dist/)
npm run build

# Preview production build
npm run preview
```

---

## Project Structure & Architecture

```
theraapp/
├── CLAUDE.md                    # This developer guide for Claude Code
├── .env.example                 # Example environment variables (GEMINI_API_KEY)
├── package.json                 # Scripts and dependencies
├── server.ts                    # Express backend serving /api/chat & /api/conclude
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript compiler configuration
├── index.html                   # HTML entry point with Fraunces & Plus Jakarta Sans
└── src/
    ├── main.tsx                 # Root entry with LanguageProvider
    ├── App.tsx                  # Master application orchestrator & state machine
    ├── types.ts                 # TypeScript interfaces (StructuredEntry, ReflectionTakeaway, etc.)
    ├── i18n.tsx                 # Complete EN / ES translation dictionary & context hook
    ├── index.css                # Tailwind CSS imports and custom animations
    ├── hooks/
    │   └── useVoiceInput.ts     # Web Speech API speech-to-text hook
    └── components/
        ├── HomeView.tsx         # Home screen (Greeting, Orb CTA, Breathe Work card)
        ├── Navigation.tsx       # Top bar & 5 bottom navigation tabs
        ├── StructuredForm.tsx   # 4-step ABC reflection entry & prompt screen
        ├── InsightsView.tsx     # The Archive (list of saved reflections & export actions)
        ├── TakeawayView.tsx     # Single reflection detail view with work plan items
        ├── BreatheView.tsx      # Paced breathing regulator
        ├── DistortionMapView.tsx# 10 Cognitive Distortions explorer
        ├── ChatSession.tsx      # Socratic reflection coach chat interface
        ├── LanguageToggle.tsx   # Flag toggle (US Flag EN / Spanish Flag ES)
        ├── USFlag.tsx           # Scalable SVG United States flag
        ├── SpanishFlag.tsx      # Scalable SVG Spanish flag
        ├── ExportClaudeModal.tsx# Export to Claude Code & data backup modal
        ├── EmotionWheel.tsx     # Categorized emotion selection component
        └── SafetyModal.tsx      # Crisis hotlines & safety disclaimer
```

---

## LocalStorage Memory Schema
TheraApp stores data locally in the user's browser:
- `thera_takeaways_v1`: Array of `ReflectionTakeaway` items (The Archive).
- `thera_unsubmitted_draft_v1`: Auto-saved unsubmitted ABC draft so users never lose in-progress typing.
- `thera_user_name_v1`: The user's chosen display name.
- `thera_app_language_v1`: `'en'` (default) or `'es'`.
- `thera_onboarding_seen_v2`: Boolean tracking whether intro tour was viewed.

---

## Coding Guidelines for Claude Code
1. **Language & Translations**: When introducing any new text to the UI, add both `en` and `es` definitions to `src/i18n.tsx` so the app remains fully bilingual.
2. **Main Page Layout**: Keep the main page (`HomeView.tsx`) clean and focused on reflection. The distortion map is accessed via the navigation tab, leaving the main page with the reflection prompt orb and the breathe work rectangle.
3. **Archive Memory**: All completed reflections MUST immediately persist to `localStorage` under `thera_takeaways_v1`.
4. **Tailwind CSS v4**: Use Tailwind CSS utility classes; avoid inline style objects or separate CSS modules.
5. **Type Safety**: Keep strict typing in `types.ts` and ensure `npm run lint` passes without errors.
