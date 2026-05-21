# GrazeSafe — Pasture & Parasite Risk Mapping Prototype

**Live demo:** https://grazesafe.vercel.app

A web-based mapping tool that shows livestock parasite risk levels across UK farms, combining real weather data with a transparent rule-based risk model. Built for Elanco Animal Health as part of the Professional Software Projects module at Sheffield Hallam University.

## What it does

- **Interactive UK map** (Leaflet.js + OpenStreetMap) with farm markers colour-coded by risk level
- **Live weather integration** — pulls temperature and rainfall from the Open-Meteo API for each farm location
- **Rule-based risk scoring** — LOW / MEDIUM / HIGH based on environmental conditions, fully explainable
- **Four parasite types** — Gastrointestinal Roundworms, Lungworms, Liver Flukes, Coccidia — each with its own risk logic
- **Side panel** — click any farm to see risk level, weather conditions, why the risk is what it is, and mitigation advice
- **Chatbot** — answers parasite and risk questions, supports map commands (zoom to city, reset view)
- **Import / Export** — add custom farms via CSV, download your farm data
- **Mobile responsive**
- **Deployed on Vercel** — no setup needed, works in the browser

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript (ES modules), Leaflet.js, Bootstrap
- **Backend:** Vercel serverless function (`api/chat.js`) for chatbot responses
- **Weather API:** Open-Meteo (live temperature and rainfall per farm location)
- **Maps:** Leaflet.js, OpenStreetMap tiles
- **Hosting:** Vercel

## Project Structure

```
/
├── index.html              # Main map view
├── parasites.html          # Parasite information pages
├── import-export.html      # Farm data import/export
├── api/
│   └── chat.js             # Vercel serverless function — chatbot logic
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
└── vercel.json             # Vercel deployment config
```

## Run locally

```bash
npm install -g vercel
vercel dev
```

Then open `http://localhost:3000`.

## Context

Group project built for Elanco Animal Health (a real external client) as part of Sheffield Hallam University's Professional Software Projects module. The brief was to prototype a digital tool to help farmers make decisions about parasite management. The app is a prototype — it does not provide medical or veterinary advice.
