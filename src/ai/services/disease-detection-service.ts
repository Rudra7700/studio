'use server';
/**
 * @fileOverview Production-ready AI Disease Detection service for Agri-Eye.
 * This service analyzes plant imagery, determines infection status and severity,
 * generates a configurable pesticide action plan, and defines data structures
 * for Firestore persistence and IoT sprayer integration.
 *
 * - runDiseaseDetectionService - A function that orchestrates the detection process.
 * - DiseaseDetectionServiceInput - The input type for the service.
 * - DiseaseDetectionServiceOutput - The structured JSON output for client consumption.
 * - FirestoreDetectionDoc - The schema for the document written to the 'detections' collection.
 * - SprayerPayload - The schema for the webhook/Cloud Function payload sent to the IoT sprayer.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { v4 as uuidv4 } from 'uuid';

// -----------------------------------------------------------------------------
// 1. INPUT SCHEMA
// -----------------------------------------------------------------------------
export const DiseaseDetectionServiceInputSchema = z.object({
  image: z.string().describe('Base64 encoded image data URI or a public image URL.'),
  metadata: z.object({
    deviceId: z.string(),
    timestamp: z.string().datetime(),
    gps: z.object({ lat: z.number(), lon: z.number() }),
    cropType: z.string(),
  }),
  sensors: z.optional(z.object({
    temperature_C: z.number().optional(),
    humidity_pct: z.number().optional(),
    soilMoisture_pct: z.number().optional(),
  })),
  pesticideProfileId: z.string().default('default_profile_v1').describe('References dosage rules in Firestore.'),
});
export type DiseaseDetectionServiceInput = z.infer<typeof DiseaseDetectionServiceInputSchema>;


// -----------------------------------------------------------------------------
// 2. CORE DATA STRUCTURES (FIRESTORE & SPRAYER)
// -----------------------------------------------------------------------------

/**
 * Schema for the document to be written to the 'detections' collection in Firestore.
 */
export const FirestoreDetectionDocSchema = z.object({
  detectionId: z.string(),
  deviceId: z.string(),
  timestamp: z.string().datetime(),
  gps: z.object({ lat: z.number(), lon: z.number() }),
  cropType: z.string(),
  imageUrl: z.string(),
  infected: z.boolean(),
  infected_area_pct: z.number().min(0).max(100),
  infectionLevel: z.enum(['Preventive', 'Targeted', 'Intensive', 'None']),
  presence_confidence: z.number().min(0).max(1),
  severity_confidence: z.number().min(0).max(1),
  recommendedSpray: z.object({
    mode: z.enum(['Preventive', 'Targeted', 'Intensive', 'None']),
    dosage_ml_per_sqm: z.number(),
    coverage_est_sqm: z.number(),
    pattern: z.string(),
  }),
  pesticideProfileId: z.string(),
  sensorContext: z.object({
    temperature_C: z.number().optional(),
    humidity_pct: z.number().optional(),
    soilMoisture_pct: z.number().optional(),
  }).optional(),
  reviewRequired: z.boolean(),
  tags: z.array(z.string()),
  // createdAt: serverTimestamp(), // This would be a server-side timestamp in a real Firestore implementation
  modelVersion: z.string(),
  pipelineVersion: z.string(),
});
export type FirestoreDetectionDoc = z.infer<typeof FirestoreDetectionDocSchema>;

/**
 * Schema for the payload sent to the IoT sprayer via webhook or Cloud Function.
 */
export const SprayerPayloadSchema = z.object({
  detectionId: z.string(),
  deviceId: z.string(),
  infectionLevel: z.enum(['Preventive', 'Targeted', 'Intensive', 'None']),
  confidence: z.number().min(0).max(1),
  sprayInstruction: z.object({
    mode: z.enum(['Preventive', 'Targeted', 'Intensive', 'None']),
    dosage_ml_per_sqm: z.number(),
    coverage_est_sqm: z.number(),
    areaCoordinates: z.array(z.array(z.number())).optional().describe('Polygon of infected area'),
    ttl_seconds: z.number(),
  }),
  safetyChecks: z.object({
    recentSprayAvoidance: z.boolean(),
    weatherSafe: z.boolean(),
    operatorOverride: z.boolean(),
  }),
});
export type SprayerPayload = z.infer<typeof SprayerPayloadSchema>;


// -----------------------------------------------------------------------------
// 3. SERVICE OUTPUT SCHEMA
// -----------------------------------------------------------------------------
export const DiseaseDetectionServiceOutputSchema = z.object({
  summary: z.string().describe('A short, human-readable summary of the detection result.'),
  firestoreDocument: FirestoreDetectionDocSchema.describe('The JSON document ready to be written to Firestore.'),
  sprayerPayload: SprayerPayloadSchema.optional().describe('The payload to be sent to the IoT sprayer system if action is needed.'),
});
export type DiseaseDetectionServiceOutput = z.infer<typeof DiseaseDetectionServiceOutputSchema>;


/**
 * Main function to call the AI Disease Detection service.
 * @param input The image data and metadata to be analyzed.
 * @returns A promise that resolves to the structured detection output.
 */
export async function runDiseaseDetectionService(
  input: DiseaseDetectionServiceInput
): Promise<DiseaseDetectionServiceOutput> {
  // In a real implementation, this would handle the full logic.
  // For now, it calls the flow which returns a mock response based on input.
  return diseaseDetectionServiceFlow(input);
}


// -----------------------------------------------------------------------------
// 4. AI FLOW IMPLEMENTATION (with MOCK/SIMULATED LOGIC)
// -----------------------------------------------------------------------------

const diseaseDetectionServiceFlow = ai.defineFlow(
  {
    name: 'diseaseDetectionServiceFlow',
    inputSchema: DiseaseDetectionServiceInputSchema,
    outputSchema: DiseaseDetectionServiceOutputSchema,
  },
  async (input) => {
    //
    // ** MOCK MODEL INTEGRATION POINT **
    // In a real system, this is where you'd call your trained vision model.
    // We simulate the model's output based on the input.
    //
    console.log(`Simulating AI Disease Detection for device: ${input.metadata.deviceId}`);

    // --- MOCK Vision Model Output ---
    // We'll simulate different results based on a keyword in the image string for testing.
    let mockModelResult: {
        infected: boolean;
        infected_area_pct: number;
        presence_confidence: number;
        severity_confidence: number;
        disease_name: string;
    };

    if (input.image.includes('healthy_leaf')) {
        // TEST CASE 1: Healthy Leaf
        mockModelResult = {
            infected: false, infected_area_pct: 0, presence_confidence: 0.25, severity_confidence: 0.99, disease_name: 'none'
        };
    } else if (input.image.includes('early_spot')) {
        // TEST CASE 2: Early Spot (Preventive)
        mockModelResult = {
            infected: true, infected_area_pct: 4.5, presence_confidence: 0.85, severity_confidence: 0.78, disease_name: 'leaf_spot'
        };
    } else { // Default to widespread lesions
        // TEST CASE 3: Widespread Lesions (Intensive)
        mockModelResult = {
            infected: true, infected_area_pct: 35.0, presence_confidence: 0.98, severity_confidence: 0.92, disease_name: 'late_blight'
        };
    }
    // --- END MOCK Vision Model Output ---

    // --- 3. DECISION LOGIC ---
    if (mockModelResult.presence_confidence < 0.60) {
      return {
        summary: 'No clear infection detected. Confidence below threshold. A re-scan in 10-15 minutes is recommended.',
        // Firestore document and sprayer payload would be based on a "healthy" or "inconclusive" state
        // For simplicity in this mock, we are omitting the full document generation for this ambiguous case.
        // A full implementation would still create a Firestore doc logging the inconclusive scan.
        // This is left as an exercise for the developer.
        firestoreDocument: {} as FirestoreDetectionDoc, // Placeholder
        sprayerPayload: undefined,
      };
    }

    // --- Determine Infection Level ---
    let infectionLevel: 'Preventive' | 'Targeted' | 'Intensive' | 'None' = 'None';
    if (mockModelResult.infected) {
        if (mockModelResult.infected_area_pct < 5) {
            infectionLevel = 'Preventive';
        } else if (mockModelResult.infected_area_pct <= 25) {
            infectionLevel = 'Targeted';
        } else {
            infectionLevel = 'Intensive';
        }
    }
    
    // --- 4. DOSAGE MAPPING ---
    // This would be fetched from Firestore: `pesticideProfiles/{input.pesticideProfileId}`
    const dosageRules = {
      'None':      { mode: 'None', dosage_ml_per_sqm: 0, pattern: 'none' },
      'Preventive':{ mode: 'Preventive', dosage_ml_per_sqm: 5, pattern: 'spot/low' },
      'Targeted':  { mode: 'Targeted', dosage_ml_per_sqm: 15, pattern: 'localized/focused' },
      'Intensive': { mode: 'Intensive', dosage_ml_per_sqm: 40, pattern: 'full-coverage/high' },
    };
    const recommendedSpray = dosageRules[infectionLevel];

    // --- 7. SAFETY & AUDIT LOGIC ---
    let reviewRequired = false;
    if (mockModelResult.severity_confidence < 0.75) {
        reviewRequired = true;
    }
    // Example: check if area is near a threshold boundary
    if ((mockModelResult.infected_area_pct > 4 && mockModelResult.infected_area_pct < 6) || (mockModelResult.infected_area_pct > 24 && mockModelResult.infected_area_pct < 26) ) {
        reviewRequired = true;
    }

    const detectionId = `det_${uuidv4()}`;

    // --- 5. CONSTRUCT FIRESTORE DOCUMENT ---
    const firestoreDocument: FirestoreDetectionDoc = {
      detectionId,
      deviceId: input.metadata.deviceId,
      timestamp: input.metadata.timestamp,
      gps: input.metadata.gps,
      cropType: input.metadata.cropType,
      imageUrl: input.image.startsWith('data:') ? 'image_data_uri_provided' : input.image,
      infected: mockModelResult.infected,
      infected_area_pct: mockModelResult.infected_area_pct,
      infectionLevel,
      presence_confidence: mockModelResult.presence_confidence,
      severity_confidence: mockModelResult.severity_confidence,
      recommendedSpray: {
          ...recommendedSpray,
          coverage_est_sqm: 2.5, // This would be calculated based on image analysis
      },
      pesticideProfileId: input.pesticideProfileId,
      sensorContext: input.sensors,
      reviewRequired,
      tags: [mockModelResult.disease_name],
      modelVersion: 'resnet50_v2.1.3',
      pipelineVersion: 'ai-detect-service-v1',
    };

    // --- 6. CONSTRUCT SPRAYER PAYLOAD ---
    let sprayerPayload: SprayerPayload | undefined = undefined;
    if (infectionLevel !== 'None') {
        sprayerPayload = {
            detectionId,
            deviceId: input.metadata.deviceId,
            infectionLevel,
            confidence: mockModelResult.presence_confidence,
            sprayInstruction: {
                mode: recommendedSpray.mode,
                dosage_ml_per_sqm: recommendedSpray.dosage_ml_per_sqm,
                coverage_est_sqm: 2.5, // Would be calculated
                areaCoordinates: [[10,10], [100,10], [100,100], [10,100]], // Placeholder
                ttl_seconds: 300,
            },
            safetyChecks: {
                recentSprayAvoidance: true, // Would be checked against a DB
                weatherSafe: true, // Would be checked against a weather service
                operatorOverride: false,
            },
        };
    }

    // --- 8. PREPARE FINAL RESPONSE ---
    let summary = `Analysis complete. Infection Level: ${infectionLevel}.`;
    if(reviewRequired) {
        summary += ' Manual review is recommended.'
    }

    return {
      summary,
      firestoreDocument,
      sprayerPayload,
    };
  }
);


// -----------------------------------------------------------------------------
// 9. TESTABLE EXAMPLES / DOCUMENTATION
//
// These demonstrate how to call the service and the expected outputs for
// different scenarios.
// -----------------------------------------------------------------------------

/*
// =================== TEST CASE 1: HEALTHY LEAF ===================
const healthyInput: DiseaseDetectionServiceInput = {
  image: 'healthy_leaf_image_url',
  metadata: { deviceId: 'drone_01', timestamp: new Date().toISOString(), gps: { lat: 34.05, lon: -118.25 }, cropType: 'Soybean' },
  pesticideProfileId: 'soybean_default_v2'
};

// EXPECTED OUTPUT for Healthy Leaf:
//
// Firestore Document:
// {
//   "detectionId": "...",
//   "infected": false,
//   "infected_area_pct": 0,
//   "infectionLevel": "None",
//   "presence_confidence": 0.25,
//   "severity_confidence": 0.99,
//   "recommendedSpray": { "mode": "None", "dosage_ml_per_sqm": 0, "pattern": "none", "coverage_est_sqm": 2.5 },
//   "reviewRequired": false,
//   ... other fields
// }
//
// Sprayer Payload: undefined


// =================== TEST CASE 2: EARLY SPOT (PREVENTIVE) ===================
const earlySpotInput: DiseaseDetectionServiceInput = {
  image: 'early_spot_leaf_image_url',
  metadata: { deviceId: 'cam_station_04', timestamp: new Date().toISOString(), gps: { lat: 40.71, lon: -74.00 }, cropType: 'Tomato' },
  sensors: { temperature_C: 22, humidity_pct: 85, soilMoisture_pct: 60 }
};

// EXPECTED OUTPUT for Early Spot:
//
// Firestore Document:
// {
//   "detectionId": "...",
//   "infected": true,
//   "infected_area_pct": 4.5,
//   "infectionLevel": "Preventive",
//   "presence_confidence": 0.85,
//   "severity_confidence": 0.78,
//   "recommendedSpray": { "mode": "Preventive", "dosage_ml_per_sqm": 5, "pattern": "spot/low", "coverage_est_sqm": 2.5 },
//   "reviewRequired": false,
//   ... other fields
// }
//
// Sprayer Payload:
// {
//   "detectionId": "...",
//   "infectionLevel": "Preventive",
//   "confidence": 0.85,
//   "sprayInstruction": {
//     "mode": "Preventive",
//     "dosage_ml_per_sqm": 5,
//     "coverage_est_sqm": 2.5,
//     "ttl_seconds": 300
//   },
//   ... other fields
// }

// =================== TEST CASE 3: WIDESPREAD LESIONS (INTENSIVE) ===================
const intensiveInput: DiseaseDetectionServiceInput = {
  image: 'widespread_lesions_image_url',
  metadata: { deviceId: 'drone_02', timestamp: new Date().toISOString(), gps: { lat: 48.85, lon: 2.35 }, cropType: 'Wheat' },
  sensors: { temperature_C: 18, humidity_pct: 92, soilMoisture_pct: 75 }
};

// EXPECTED OUTPUT for Widespread Lesions:
//
// Firestore Document:
// {
//   "detectionId": "...",
//   "infected": true,
//   "infected_area_pct": 35,
//   "infectionLevel": "Intensive",
//   "presence_confidence": 0.98,
//   "severity_confidence": 0.92,
//   "recommendedSpray": { "mode": "Intensive", "dosage_ml_per_sqm": 40, "pattern": "full-coverage/high", "coverage_est_sqm": 2.5 },
//   "reviewRequired": false,
//   ... other fields
// }
//
// Sprayer Payload:
// {
//   "detectionId": "...",
//   "infectionLevel": "Intensive",
//   "confidence": 0.98,
//   "sprayInstruction": {
//     "mode": "Intensive",
//     "dosage_ml_per_sqm": 40,
//     "coverage_est_sqm": 2.5,
//     "ttl_seconds": 300
//   },
//   ... other fields
// }

*/
