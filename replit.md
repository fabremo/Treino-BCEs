# Treino BCEs - Inglês Pra Viagem

## Overview
A Portuguese language learning application for English travel phrases. The app helps users practice common English phrases organized by situations for everyday communication during travel.

## Tech Stack
- React 19 with TypeScript
- Vite as build tool
- React Router DOM for navigation
- Tailwind CSS (via CDN)

## Project Structure
```
/
├── components/      # React components (Layout, PhraseCard)
├── data/           # Phrase data
├── hooks/          # Custom hooks (useFavorites, useSpeech, useTTSSettings)
├── pages/          # Page components (Home, Situations, Favorites, Settings)
├── App.tsx         # Main app with routing
├── index.tsx       # Entry point
├── index.html      # HTML template
└── vite.config.ts  # Vite configuration
```

## Development
- Run: `npm run dev` (serves on port 5000)
- Build: `npm run build` (outputs to dist/)

## Configuration
- Vite configured to use port 5000 with allowedHosts enabled for Replit proxy
- Uses GEMINI_API_KEY environment variable if needed for API features
