import type { Farmer, Field, Drone, Treatment, SensorData, MandiPrice, Pesticide } from './types';
import { subDays, format } from 'date-fns';

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
    name: 'Central Rice Paddy',
    farmerId: 'farmer-2',
    cropType: 'Rice',
    gpsCoordinates: { lat: 28.5900, lng: 77.2150 },
    boundary: [],
    healthStatus: 'Severe',
    imageUrl: 'https://picsum.photos/seed/field3/800/600',
    imageHint: 'rice paddy',
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
    disease: 'Rice Blast',
    treatment: 'Fungicide Application - Tricyclazole',
    scheduledDate: new Date().toISOString(),
    status: 'Completed',
    executedBy: 'drone-002',
  },
    {
    id: 'treat-3',
    fieldId: 'field-3',
    disease: 'Brown Spot',
    treatment: 'Nutrient Boost and Water Management',
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


export const mockMandiPrices: MandiPrice = {
    currentPrice: 2250,
    nearbyMandis: [
        { mandiName: "Ujjain", price: 2275 },
        { mandiName: "Dewas", price: 2240 },
        { mandiName: "Sehore", price: 2260 },
    ],
    priceTrend: Array.from({ length: 7 }, (_, i) => {
        const date = subDays(new Date(), 6 - i);
        return {
            date: date.toISOString(),
            price: 2200 + (i * 5) + (Math.sin(i) * 20) + (Math.random() * 30),
        };
    }),
    priceAnalysis: "The market for wheat is currently stable with a slight upward trend over the past week. Prices in nearby mandis are competitive. Good demand is expected to continue.",
};

export const mockPesticides: Pesticide[] = [
    {
        id: 'pest-1',
        name: 'Propiconazole 25% EC',
        type: 'Fungicide',
        description: 'A broad-spectrum systemic fungicide for the control of a wide range of leaf and stem diseases in cereals, fruits, and vegetables.',
        price: 1200,
        unit: '1 Litre',
        imageUrl: 'https://picsum.photos/seed/bottle1/300/300',
        usage: {
            dosage: '200-300 ml per acre.',
            method: 'Foliar spray. Mix with water and apply evenly.',
        },
        safetyNotes: ['Wear protective clothing.', 'Do not inhale.', 'Keep away from children and food.'],
    },
    {
        id: 'pest-2',
        name: 'Imidacloprid 17.8% SL',
        type: 'Insecticide',
        description: 'An effective insecticide for controlling sucking pests like aphids, jassids, and whiteflies in cotton, rice, and vegetables.',
        price: 850,
        unit: '500 ml',
        imageUrl: 'https://picsum.photos/seed/bottle2/300/300',
        usage: {
            dosage: '100-150 ml per acre.',
            method: 'Can be used as a foliar spray or for seed treatment.',
        },
        safetyNotes: ['Harmful if swallowed.', 'Avoid contact with skin and eyes.', 'Environmentally hazardous.'],
    },
    {
        id: 'pest-3',
        name: 'Glyphosate 41% SL',
        type: 'Herbicide',
        description: 'A non-selective, post-emergence herbicide for the control of annual and perennial weeds in non-crop areas and for pre-sowing application.',
        price: 1500,
        unit: '1 Litre',
        imageUrl: 'https://picsum.photos/seed/bottle3/300/300',
        usage: {
            dosage: '0.8-1.2 litres per acre.',
            method: 'Apply to actively growing weeds. Avoid spray drift to desired crops.',
        },
        safetyNotes: ['Causes serious eye irritation.', 'Toxic to aquatic life with long-lasting effects.', 'Use a spray shield.'],
    },
     {
        id: 'pest-4',
        name: 'Neem Oil Concentrate',
        type: 'Other',
        description: 'An organic, broad-spectrum pest control solution effective against mites, aphids, and other common pests. Safe for organic farming.',
        price: 950,
        unit: '1 Litre',
        imageUrl: 'https://picsum.photos/seed/bottle4/300/300',
        usage: {
            dosage: '5-10 ml per litre of water.',
            method: 'Foliar spray. Apply in the evening to avoid leaf burn.',
        },
        safetyNotes: ['Generally safe, but avoid direct contact with eyes.', 'Keep stored in a cool, dark place.'],
    },
    {
        id: 'pest-5',
        name: 'NIHAL PLUS (Sulfosulfuron 70% WG)',
        type: 'Herbicide',
        description: 'A selective, post-emergence herbicide for the control of grassy weeds, especially Phalaris minor, in wheat crops.',
        price: 1800,
        unit: '20 gm',
        imageUrl: 'https://picsum.photos/seed/bottle5/300/300',
        usage: {
            dosage: '13.5 gm per acre.',
            method: 'Mix with 200 liters of water and spray uniformly over one acre.',
        },
        safetyNotes: ['Use flat fan or flood jet nozzles for uniform spray.', 'Avoid spray drift to neighboring crops like mustard, gram etc.'],
    },
    {
        id: 'pest-6',
        name: 'ATRAGIL (Atrazine 50% WP)',
        type: 'Herbicide',
        description: 'A pre-emergence and early post-emergence herbicide for the control of annual grasses and broadleaf weeds in maize, sugarcane, and sorghum.',
        price: 750,
        unit: '500 gm',
        imageUrl: 'https://picsum.photos/seed/bottle6/300/300',
        usage: {
            dosage: '0.5-1.0 kg per acre.',
            method: 'Spray on soil surface before weed emergence for best results.',
        },
        safetyNotes: ['Do not use in sandy soil as it may cause crop injury.', 'Ensure sufficient soil moisture for activation.'],
    },
    {
        id: 'pest-7',
        name: 'GIL 2,4D (2,4-D Amine Salt 58% SL)',
        type: 'Herbicide',
        description: 'A selective, systemic herbicide used for the control of broad-leaved weeds in cereals, sugarcane, and non-crop areas.',
        price: 600,
        unit: '1 Litre',
        imageUrl: 'https://picsum.photos/seed/bottle7/300/300',
        usage: {
            dosage: '400-600 ml per acre.',
            method: 'Apply when weeds are young and actively growing.',
        },
        safetyNotes: ['Avoid spraying during windy conditions.', 'Harmful to cotton, grapes, and other sensitive broad-leaved crops.'],
    },
    {
        id: 'pest-8',
        name: 'KHUSALI (Mepiquat Chloride 5% AS)',
        type: 'Other',
        description: 'A plant growth regulator that controls vegetative growth and enhances reproductive growth, leading to better cotton yields.',
        price: 1100,
        unit: '1 Litre',
        imageUrl: 'https://picsum.photos/seed/bottle8/300/300',
        usage: {
            dosage: '250-500 ml per acre.',
            method: 'Apply at the flowering or boll formation stage in cotton.',
        },
        safetyNotes: ['Follow the recommended dosage strictly to avoid adverse effects on crop growth.', 'Store in a cool, dry place.'],
    }
];
