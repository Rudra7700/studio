const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

admin.initializeApp(); // In emulator, uses default credentials; in prod ensure service account is configured
const db = admin.firestore();
const storage = admin.storage().bucket(); // uses default bucket in firebase config

const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: "10mb" })); // allow base64 images up to ~10MB

// Utility: parse data URI like "data:image/jpeg;base64,/9j/..."
function parseDataUri(dataUri) {
  const match = /^data:(.+);base64,(.*)$/.exec(dataUri);
  if (!match) return null;
  return { mime: match[1], base64: match[2] };
}

function mapSeverity(infected_area_pct, presence_confidence) {
  // thresholds from your prompt; tweak as needed
  if (presence_confidence < 0.60) return { infectionLevel: "None", reviewRequired: true };
  if (infected_area_pct < 5) return { infectionLevel: "Preventive", reviewRequired: false };
  if (infected_area_pct <= 25) return { infectionLevel: "Targeted", reviewRequired: false };
  return { infectionLevel: "Intensive", reviewRequired: true };
}

function dosageForLevel(level, pesticideProfileId = "default") {
  // sample, should be read from pesticideProfiles collection in production
  const map = {
    Preventive: { mode: "Preventive", dosage_ml_per_sqm: 5, pattern: "spot/low" },
    Targeted:   { mode: "Targeted",   dosage_ml_per_sqm: 15, pattern: "localized/focused" },
    Intensive:  { mode: "Intensive",   dosage_ml_per_sqm: 40, pattern: "full-coverage/high" },
    None:       { mode: "None",        dosage_ml_per_sqm: 0, pattern: "none" }
  };
  return map[level] || map["None"];
}

app.post("/detect", async (req, res) => {
  try {
    const {
      image, // optional data URI or imageUrl
      metadata = {},
      sensors = {},
      infected_area_pct,
      presence_confidence,
      severity_confidence,
      pesticideProfileId
    } = req.body;

    if (presence_confidence === undefined || infected_area_pct === undefined) {
      return res.status(400).json({ error: "Missing infected_area_pct or presence_confidence in request body." });
    }

    // Upload image if dataURI provided
    let imageUrl = null;
    if (image && image.startsWith("data:")) {
      const parsed = parseDataUri(image);
      if (!parsed) return res.status(400).json({ error: "Invalid data URI for image." });

      const buffer = Buffer.from(parsed.base64, "base64");
      const filename = `detections/${Date.now()}.${parsed.mime.split("/")[1] || "jpg"}`;
      const file = storage.file(filename);

      await file.save(buffer, { contentType: parsed.mime, resumable: false });
      // generate signed URL (long expiry for demo; change for production)
      const [url] = await file.getSignedUrl({ action: "read", expires: "2030-01-01" });
      imageUrl = url;
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
    }

    // Decision logic
    const severity = mapSeverity(Number(infected_area_pct), Number(presence_confidence));
    const recommended = dosageForLevel(severity.infectionLevel, pesticideProfileId);

    // coverage estimate: assume infected_area_pct of 1 plant area (example)
    const coverage_est_sqm = Math.max(0.1, (Number(infected_area_pct) / 100) * 1.0); // simplistic

    const detectionDoc = {
      deviceId: metadata.deviceId || null,
      timestamp: metadata.timestamp || new Date().toISOString(),
      gps: metadata.gps || null,
      cropType: metadata.cropType || null,
      imageUrl,
      infected: severity.infectionLevel !== "None",
      infected_area_pct: Number(infected_area_pct),
      infectionLevel: severity.infectionLevel,
      presence_confidence: Number(presence_confidence),
      severity_confidence: Number(severity_confidence || presence_confidence),
      recommendedSpray: {
        mode: recommended.mode,
        dosage_ml_per_sqm: recommended.dosage_ml_per_sqm,
        coverage_est_sqm,
        pattern: recommended.pattern
      },
      pesticideProfileId: pesticideProfileId || null,
      sensorContext: sensors,
      reviewRequired: severity.reviewRequired,
      tags: [],
      modelVersion: "v1.0.0",
      pipelineVersion: "ai-detect-quickstart",
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection("detections").add(detectionDoc);
    const sprayerPayload = {
      detectionId: docRef.id,
      deviceId: detectionDoc.deviceId,
      infectionLevel: detectionDoc.infectionLevel,
      confidence: detectionDoc.severity_confidence,
      sprayInstruction: {
        mode: detectionDoc.recommendedSpray.mode,
        dosage_ml_per_sqm: detectionDoc.recommendedSpray.dosage_ml_per_sqm,
        coverage_est_sqm: detectionDoc.recommendedSpray.coverage_est_sqm,
        areaCoordinates: null,
        ttl_seconds: 300
      },
      safetyChecks: {
        recentSprayAvoidance: false,
        weatherSafe: true,
        operatorOverride: false
      }
    };

    return res.status(200).json({ detectionId: docRef.id, detection: detectionDoc, sprayerPayload });
  } catch (err) {
    console.error("detect error:", err);
    return res.status(500).json({ error: err.message || "internal error" });
  }
});

// Export for Firebase functions
exports.api = functions.https.onRequest(app);
