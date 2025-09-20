
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
  try {
    // Log incoming request metadata for debugging (remove or lower in prod)
    console.log("POST /detect payload keys:", Object.keys(req.body));

    const { metadata = {}, infected_area_pct, presence_confidence, severity_confidence } = req.body;

    if (infected_area_pct === undefined || presence_confidence === undefined) {
      return res.status(400).json({ error: "Missing infected_area_pct or presence_confidence" });
    }

    const infectionLevel =
      presence_confidence < 0.6 ? "None" :
      infected_area_pct < 5 ? "Preventive" :
      infected_area_pct <= 25 ? "Targeted" : "Intensive";

    let doc = {
      deviceId: metadata.deviceId || null,
      timestamp: metadata.timestamp || new Date().toISOString(),
      cropType: metadata.cropType || null,
      infected: infectionLevel !== "None",
      infected_area_pct: Number(infected_area_pct),
      infectionLevel,
      presence_confidence: Number(presence_confidence),
      severity_confidence: Number(severity_confidence || presence_confidence),
      health_score: 100 - (Number(infected_area_pct) * 1.5),
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const finalDoc = finalizeDetection(doc);

    const ref = await db.collection("detections_test_no_storage").add(finalDoc);

    return res.status(200).json({ detectionId: ref.id, detection: finalDoc });
  } catch (err) {
    // Always return JSON so client JSON.parse() doesn't break
    console.error("Server error in /detect:", err && err.stack ? err.stack : err);
    // Expose detailed error only in emulator/dev; in production remove err.stack
    const isEmulator = !!process.env.FUNCTIONS_EMULATOR;
    return res.status(500).json({
      error: "Internal Server Error",
      message: err && err.message ? err.message : String(err),
      ...(isEmulator ? { stack: err.stack } : {})
    });
  }
});

exports.api = functions.https.onRequest(app);
