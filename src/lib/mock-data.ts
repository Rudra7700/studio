import type { Farmer, Field, Drone, Treatment, SensorData } from './types';

export const mockFarmers: Farmer[] = [
  {
    id: 'farmer-1',
    name: 'Rajesh Kumar',
    email: 'rajesh.k@example.com',
    avatarUrl: 'https://picsum.photos/seed/farmer1/100/100',
    fields: ['field-1', 'field-2'],
  },
  {
    id: 'farmer-2',
    name: 'Anjali Sharma',
    email: 'anjali.s@example.com',
    avatarUrl: 'https://picsum.photos/seed/farmer2/100/100',
    fields: ['field-3'],
  },
];

export const mockFields: Field[] = [
  {
    id: 'field-1',
    name: 'North Corn Field',
    farmerId: 'farmer-1',
    cropType: 'Corn',
    gpsCoordinates: { lat: 28.6139, lng: 77.2090 },
    boundary: [
      { lat: 28.615, lng: 77.210 },
      { lat: 28.615, lng: 77.212 },
      { lat: 28.613, lng: 77.212 },
      { lat: 28.613, lng: 77.210 },
    ],
    healthStatus: 'Healthy',
    imageUrl: 'https://picsum.photos/seed/field1/800/600',
    imageHint: 'corn field',
  },
  {
    id: 'field-2',
    name: 'West Wheat Patch',
    farmerId: 'farmer-1',
    cropType: 'Wheat',
    gpsCoordinates: { lat: 28.6100, lng: 77.2050 },
    boundary: [],
    healthStatus: 'Mild',
    imageUrl: 'https://picsum.photos/seed/field2/800/600',
    imageHint: 'wheat field',
  },
  {
    id: 'field-3',
    name: 'Soybean Central',
    farmerId: 'farmer-2',
    cropType: 'Soybean',
    gpsCoordinates: { lat: 28.5900, lng: 77.2150 },
    boundary: [],
    healthStatus: 'Severe',
    imageUrl: 'https://picsum.photos/seed/field3/800/600',
    imageHint: 'soybean field',
  },
];

export const mockDrones: Drone[] = [
  {
    id: 'drone-001',
    model: 'AgriPro-X1',
    status: 'Idle',
    batteryLevel: 95,
    tankLevel: 100,
    location: { lat: 28.6000, lng: 77.2000 },
  },
  {
    id: 'drone-002',
    model: 'FarmHawk-2',
    status: 'Charging',
    batteryLevel: 45,
    tankLevel: 0,
    location: { lat: 28.6000, lng: 77.2000 },
  },
  {
    id: 'drone-003',
    model: 'AgriPro-X1',
    status: 'Maintenance',
    batteryLevel: 100,
    tankLevel: 100,
    location: { lat: 28.6000, lng: 77.2000 },
  },
];

export const mockTreatments: Treatment[] = [
  {
    id: 'treat-1',
    fieldId: 'field-2',
    disease: 'Wheat Rust',
    treatment: 'Fungicide Application - Propiconazole',
    scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Scheduled',
    executedBy: 'drone-001',
  },
  {
    id: 'treat-2',
    fieldId: 'field-3',
    disease: 'Soybean Aphids',
    treatment: 'Insecticide Application - Lambda-cyhalothrin',
    scheduledDate: new Date().toISOString(),
    status: 'Completed',
    executedBy: 'drone-002',
  },
    {
    id: 'treat-3',
    fieldId: 'field-3',
    disease: 'Root Rot',
    treatment: 'Nutrient Boost and Soil Aeration',
    scheduledDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Completed',
    executedBy: 'drone-001',
  },
];

export const mockSensorData: SensorData = {
  soilMoisture: 65,
  humidity: 75,
  temperature: 28,
};
