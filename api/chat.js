// Vercel serverless function — rule-based GrazeSafe chatbot
// No external AI API needed — fully self-contained

const UK_CITIES = {
  leeds: { lat: 53.8008, lng: -1.5491, zoom: 11 },
  manchester: { lat: 53.4808, lng: -2.2426, zoom: 11 },
  york: { lat: 53.9591, lng: -1.0815, zoom: 12 },
  sheffield: { lat: 53.3811, lng: -1.4701, zoom: 11 },
  lincoln: { lat: 53.2307, lng: -0.5406, zoom: 12 },
  nottingham: { lat: 52.9548, lng: -1.1581, zoom: 11 },
  derby: { lat: 52.9225, lng: -1.4746, zoom: 12 },
  Leicester: { lat: 52.6369, lng: -1.1398, zoom: 11 },
  birmingham: { lat: 52.4862, lng: -1.8904, zoom: 11 },
  bristol: { lat: 51.4545, lng: -2.5879, zoom: 11 },
  exeter: { lat: 50.7184, lng: -3.5339, zoom: 12 },
  cardiff: { lat: 51.4816, lng: -3.1791, zoom: 11 },
  edinburgh: { lat: 55.9533, lng: -3.1883, zoom: 11 },
  glasgow: { lat: 55.8642, lng: -4.2518, zoom: 11 },
  inverness: { lat: 57.4778, lng: -4.2247, zoom: 12 },
  newcastle: { lat: 54.9783, lng: -1.6178, zoom: 11 },
  "lake district": { lat: 54.4609, lng: -3.0886, zoom: 10 },
  cornwall: { lat: 50.2660, lng: -5.0527, zoom: 9 },
  wales: { lat: 52.1307, lng: -3.7837, zoom: 7 },
  scotland: { lat: 56.4907, lng: -4.2026, zoom: 6 },
};

const RESPONSES = {
  help: `I can help with: parasite risk questions, understanding risk levels, and map controls.\n\nMap commands: "reset view", "zoom to [city]" (e.g. "zoom to Leeds").\n\nTry asking: "What does high risk mean?" or "What is a liver fluke?"`,

  reset: { reply: "Resetting the map to the full UK view.", action: { type: "resetView" } },

  parasite: `Parasites are organisms that live on or inside animals and can harm their health. Common livestock parasites include gastrointestinal roundworms, lungworms, liver flukes, and coccidia.\n\nThis tool tracks environmental conditions that affect how well larvae survive on pasture — wetter and milder conditions generally increase risk.`,

  roundworm: `Gastrointestinal roundworms are the most common internal parasites in cattle and sheep. Larvae survive on pasture and are swallowed during grazing. Wet, mild conditions increase survival on pasture.\n\nIf risk is elevated, consider rotating grazing areas and monitoring animals for signs of reduced weight gain or appetite. Speak to your vet or advisor for treatment decisions.`,

  lungworm: `Lungworms affect the respiratory system of cattle and sheep. Signs include coughing and breathing changes in younger animals. Wet conditions and mild temperatures support larvae survival.\n\nIf risk is elevated, monitor for coughing, reduce exposure to heavily grazed pasture, and speak to a vet if symptoms appear.`,

  fluke: `Liver flukes infect cattle and sheep and cause liver damage. They're linked to wet, poorly-drained pasture where the mud snail host lives. Risk is higher after wet summers and mild winters.\n\nIf risk is elevated, avoid wet or waterlogged grazing areas where possible. Speak to a vet or advisor about monitoring and management.`,

  coccidia: `Coccidia are single-celled parasites that mainly affect younger animals, causing scours (diarrhoea) and poor growth. They thrive in warm, moist environments.\n\nIf risk is elevated, maintain pasture hygiene, avoid overcrowding, and monitor younger animals closely. Speak to a vet for management advice.`,

  low: `Low risk means current weather conditions — temperature and rainfall — are less favourable for parasite larvae survival on pasture. Typically drier and/or colder conditions.\n\nLow risk doesn't mean zero risk, just that environmental pressure is reduced right now.`,

  medium: `Medium risk means conditions are somewhat favourable for parasite larvae survival — typically some rainfall combined with mild temperatures.\n\nIt's worth staying alert and monitoring animals, especially if risk has been rising.`,

  high: `High risk means weather conditions are more favourable for parasite larvae survival on pasture — typically wetter conditions with mild temperatures.\n\nConsider reviewing grazing management, rotating pasture if possible, and speaking to your vet or advisor about monitoring and next steps.`,

  calculate: `Risk is calculated using two environmental factors from the Open-Meteo weather API:\n\n1. Recent rainfall (mm over 7 days)\n2. Average temperature (°C)\n\nHigher rainfall + mild temperatures = higher risk score. The thresholds are transparent and rule-based — this is a prototype discussion tool, not a clinical diagnostic system.`,

  fec: `FEC (Faecal Egg Count) testing is a way to check the actual worm burden in your animals by analysing dung samples. It gives a direct measure rather than an environmental estimate.\n\nThis tool shows environmental risk on pasture — FEC testing tells you what's actually happening inside your animals. Both together give a fuller picture. Speak to your vet or an SQP about FEC testing options.`,

  default: `I can answer questions about parasite risk, the map, and what the risk levels mean.\n\nTry: "What does high risk mean?", "What is a liver fluke?", "How is risk calculated?", or use "zoom to [city]" to navigate the map.`
};

function buildReply(message) {
  const msg = message.toLowerCase().trim();

  // Map actions
  if (msg === "reset" || msg === "reset view" || msg === "reset map") {
    return RESPONSES.reset;
  }

  const zoomMatch = msg.match(/zoom (?:to|in on|into)?\s*(.+)/);
  if (zoomMatch) {
    const place = zoomMatch[1].trim().toLowerCase();
    const coords = UK_CITIES[place];
    if (coords) {
      return {
        reply: `Zooming to ${place.charAt(0).toUpperCase() + place.slice(1)}.`,
        action: { type: "zoomTo", value: coords }
      };
    }
    return {
      reply: `I don't have coordinates for "${zoomMatch[1].trim()}" — try a major UK city like Leeds, Manchester, Sheffield, or Edinburgh.`,
      action: { type: "none" }
    };
  }

  if (msg === "help" || msg === "commands" || msg === "what can you do") {
    return { reply: RESPONSES.help, action: { type: "none" } };
  }

  // Parasite questions
  if (msg.includes("roundworm") || msg.includes("gut worm") || msg.includes("stomach worm")) {
    return { reply: RESPONSES.roundworm, action: { type: "none" } };
  }
  if (msg.includes("lungworm") || msg.includes("lung worm") || msg.includes("cough")) {
    return { reply: RESPONSES.lungworm, action: { type: "none" } };
  }
  if (msg.includes("fluke") || msg.includes("liver")) {
    return { reply: RESPONSES.fluke, action: { type: "none" } };
  }
  if (msg.includes("coccidia") || msg.includes("coccidiosis")) {
    return { reply: RESPONSES.coccidia, action: { type: "none" } };
  }
  if (msg.includes("parasite") || msg.includes("worm")) {
    return { reply: RESPONSES.parasite, action: { type: "none" } };
  }

  // Risk level questions
  if (msg.includes("high risk") || msg.includes("what is high") || msg.includes("what does high")) {
    return { reply: RESPONSES.high, action: { type: "none" } };
  }
  if (msg.includes("medium risk") || msg.includes("what is medium") || msg.includes("what does medium")) {
    return { reply: RESPONSES.medium, action: { type: "none" } };
  }
  if (msg.includes("low risk") || msg.includes("what is low") || msg.includes("what does low")) {
    return { reply: RESPONSES.low, action: { type: "none" } };
  }
  if (msg.includes("risk level") || msg.includes("risk mean") || msg.includes("risk score")) {
    return { reply: RESPONSES.medium, action: { type: "none" } };
  }

  // How it works
  if (msg.includes("calculat") || msg.includes("how does") || msg.includes("how do you") || msg.includes("how is")) {
    return { reply: RESPONSES.calculate, action: { type: "none" } };
  }

  // FEC
  if (msg.includes("fec") || msg.includes("faecal") || msg.includes("fecal") || msg.includes("egg count")) {
    return { reply: RESPONSES.fec, action: { type: "none" } };
  }

  // What to do
  if (msg.includes("what should i do") || msg.includes("what do i do") || msg.includes("advice") || msg.includes("treatment")) {
    return {
      reply: "For general guidance: rotate grazing areas where possible, monitor animals for signs of poor condition or appetite changes, and consider FEC testing to check actual worm burden. For treatment decisions, always speak to your vet or an SQP — this tool provides environmental risk indicators only.",
      action: { type: "none" }
    };
  }

  return { reply: RESPONSES.default, action: { type: "none" } };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body || {};

  if (!message) {
    return res.json({ reply: "Please type a message.", action: { type: "none" } });
  }

  const result = buildReply(message);
  return res.json(result);
}
