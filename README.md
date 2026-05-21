# GrazeSafe — Pasture & Parasite Risk Mapping Prototype

A web-based mapping tool that shows livestock parasite risk levels across UK farms, combining real weather data with a transparent rule-based risk model. Built for Elanco Animal Health as part of the Professional Software Projects module at Sheffield Hallam University.

## What it does

- **Interactive UK map** (Leaflet.js + OpenStreetMap) with farm markers colour-coded by risk level
- **Live weather integration** — pulls temperature and rainfall from the Open-Meteo API for each farm location
- **Rule-based risk scoring** — LOW / MEDIUM / HIGH based on environmental conditions, fully explainable
- **Four parasite types** — Gastrointestinal Roundworms, Lungworms, Liver Flukes, Coccidia — each with its own risk logic
- **Side panel** — click any farm to see risk level, weather conditions, why the risk is what it is, and mitigation advice
- **AI chatbot** — Claude-powered assistant (via Ollama backend) that answers farmer questions in plain English, never diagnoses, never prescribes
- **Import / Export** — add custom farms via CSV, download your farm data
- **Mobile responsive**

## Tech Stack

- **Frontend:** HTML, CSS (custom), JavaScript (ES modules), Leaflet.js, Bootstrap
- **Backend:** Node.js + Express (serves frontend, handles chatbot proxy)
- **APIs:** Open-Meteo (weather), Ollama (local LLM for chatbot)
- **Maps:** Leaflet.js, OpenStreetMap tiles

## Project Structure

```
/
├── index.html              # Main map view
├── parasites.html          # Parasite information pages
├── import-export.html      # Farm data import/export
├── backend/
│   └── server.js           # Express server with chatbot endpoint
├── scripts/
│   ├── app.js              # Main app logic, farm rendering, panel updates
│   ├── map.js              # Leaflet map init, custom controls
│   ├── api.js              # Open-Meteo weather API calls
│   ├── data.js             # Mock farm dataset (UK locations)
│   ├── utils.js            # Risk scoring logic
│   ├── weather.js          # Weather data processing
│   ├── chatbot.js          # Chatbot UI
│   └── import-export.js    # CSV import/export
├── styles/
│   └── main.css
└── tests/
    └── ui.test.js
```

## Setup

```bash
# Install backend dependencies
cd backend && npm install

# Start the server
node server.js

# Open in browser
# → http://localhost:3000
```

For the AI chatbot to work, you'll need [Ollama](https://ollama.com) running locally with a model pulled (e.g. `ollama pull llama3`).

## Context

Group project built for Elanco Animal Health (a real client) as part of Sheffield Hallam University's Professional Software Projects module. The brief was to prototype a digital tool to help farmers make decisions about parasite management. The app is a prototype — it does not provide medical or veterinary advice.
