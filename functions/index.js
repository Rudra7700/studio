
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: "10mb" }));

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

    const doc = {
      deviceId: metadata.deviceId || null,
      timestamp: metadata.timestamp || new Date().toISOString(),
      cropType: metadata.cropType || null,
      infected: infectionLevel !== "None",
      infected_area_pct: Number(infected_area_pct),
      infectionLevel,
      presence_confidence: Number(presence_confidence),
      severity_confidence: Number(severity_confidence || presence_confidence),
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const ref = await db.collection("detections_test_no_storage").add(doc);

    return res.status(200).json({ detectionId: ref.id, detection: doc });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || "internal error" });
  }
});

exports.api = functions.https.onRequest(app);
