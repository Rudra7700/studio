
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));

// Increase body size to allow base64 images later
app.use(express.json({ limit: "20mb" }));

// JSON parse error handler (returns valid JSON instead of HTML)
app.use((err, req, res, next) => {
  if (err && err.type === "entity.parse.failed") {
    console.error("JSON parse error:", err.message);
    return res.status(400).json({ error: "Invalid JSON payload", details: err.message });
  }
  next(err);
});

// conservative safety wrapper - put before writing detection & returning result
function finalizeDetection(detection) {
  const pc = Number(detection.presence_confidence || 0);
  const sc = Number(detection.severity_confidence || pc);
  const area = Number(detection.infected_area_pct || 0);
  let hs = Number(detection.health_score ?? (100 - area)); // fallback

  if (hs > 85 && area > 5) {
    detection.reviewRequired = true;
    detection.finalHealthDisplay = "Uncertain — lesions detected; manual review required";
    return detection;
  }

  if (pc >= 0.6 && hs > 85 && sc < 0.75) {
    detection.reviewRequired = true;
    detection.finalHealthDisplay = "Uncertain — low severity confidence; manual review required";
    return detection;
  }

  if (area >= 5 && pc >= 0.5) {
    detection.infected = true;
    detection.infectionLevel = area <= 5 ? "Preventive" : area <= 25 ? "Targeted" : "Intensive";
    detection.reviewRequired = sc < 0.75;
    detection.finalHealthDisplay = `${Math.max(0, 100 - Math.round(area))}/100 (estimated)`;
    return detection;
  }

  detection.reviewRequired = pc >= 0.5 && pc < 0.75;
  detection.finalHealthDisplay = `${Math.round(hs)}/100`;
  return detection;
}

app.post("/detect", async (req, res) => {
  // Temporarily simplified endpoint for debugging
  try {
    console.log("Simplified /detect endpoint hit. Body:", req.body);
    res.set('Content-Type', 'application/json');
    res.status(200).json({ 
        detectionId: "test-id-123",
        detection: {
            finalHealthDisplay: "Test OK",
            infectionLevel: "None",
            infected_area_pct: 0,
            presence_confidence: 1.0,
            reviewRequired: false,
            health_score: 100
        },
        message: "This is a temporary debug response. The backend logic is currently bypassed." 
    });
  } catch (err) {
    // Fallback error handler for the simplified endpoint
    console.error("Error in simplified /detect:", err.stack);
    res.status(500).json({
      error: "Internal Server Error in simplified endpoint",
      message: err.message,
    });
  }
});

exports.api = functions.https.onRequest(app);
