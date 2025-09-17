import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-field-health.ts';
import '@/ai/flows/get-treatment-recommendations.ts';
import '@/ai/flows/assistant-flow.ts';
import '@/ai/flows/assistant-schema.ts';
