
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: "10mb" }));

// conservative safety wrapper - put before writing detection & returning result
function finalizeDetection(detection) {
  // detection: { presence_confidence, severity_confidence, infected_area_pct, health_score }
  const pc = Number(detection.presence_confidence || 0);
  const sc = Number(detection.severity_confidence || pc);
  const area = Number(detection.infected_area_pct || 0);
  let hs = Number(detection.health_score ?? (100 - area)); // fallback

  // 1) Inconsistency guard: if model says healthy (hs>85) but infected area > small threshold => require review
  if (hs > 85 && area > 5) {
    detection.reviewRequired = true;
    detection.finalHealthDisplay = "Uncertain — lesions detected; manual review required";
    return detection;
  }

  // 2) Confidence guard: avoid trusting health_score unless presence_confidence is low or severity_confidence supports it
  if (pc >= 0.6 && hs > 85 && sc < 0.75) {
    detection.reviewRequired = true;
    detection.finalHealthDisplay = "Uncertain — low severity confidence; manual review required";
    return detection;
  }

  // 3) If presence_confidence moderate but infected_area_pct shows visible infection, treat as infected
  if (area >= 5 && pc >= 0.5) {
    detection.infected = true;
    detection.infectionLevel = area <= 5 ? "Preventive" : area <= 25 ? "Targeted" : "Intensive";
    detection.reviewRequired = sc < 0.75; // still request review if severity low
    detection.finalHealthDisplay = `${Math.max(0, 100 - Math.round(area))}/100 (estimated)`;
    return detection;
  }

  // 4) Otherwise, show sanitized health score and no immediate action
  detection.reviewRequired = pc >= 0.5 && pc < 0.75; // moderate confidence => recommended review
  detection.finalHealthDisplay = `${Math.round(hs)}/100`;
  return detection;
}


app.post("/detect", async (req, res) => {
  try {
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
    
    // Apply the conservative safety wrapper
    const finalDoc = finalizeDetection(doc);

    const ref = await db.collection("detections_test_no_storage").add(finalDoc);

    return res.status(200).json({ detectionId: ref.id, detection: finalDoc });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || "internal error" });
  }
});

exports.api = functions.https.onRequest(app);
