
import type { Farmer, Field, Drone, Treatment, SensorData, MandiPrice, Pesticide, MandiPriceCardData } from './types';
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

const createMockPrice = (base: number, volatility: number, cropName: string): MandiPriceCardData => {
  const price = base + Math.random() * base * 0.1 - base * 0.05;
  const change = (Math.random() - 0.4) * base * volatility;
  const percentChange = (change / price) * 100;
  const imageHint = cropName.toLowerCase().replace(/ \([^)]*\)/, '').replace(' ', '-');
  return {
    name: cropName,
    mandi: ['Delhi', 'Punjab', 'Gujarat', 'UP', 'MP', 'Haryana'][Math.floor(Math.random() * 6)] + ' Mandi',
    price: Math.round(price / 10) * 10,
    change: Math.round(change),
    percentChange: parseFloat(percentChange.toFixed(1)),
    imageUrl: `https://picsum.photos/seed/${imageHint}/400/300`,
    imageHint: imageHint,
  };
};

export function generateMockLiveMandiPrices(): Record<string, MandiPriceCardData[]> {
  return {
    Cereals: [
      { ...createMockPrice(2150, 0.1, 'Wheat'), imageUrl: 'https://images.unsplash.com/photo-1437252611977-07f74518abd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHx3aGVhdHxlbnwwfHx8fDE3NTg0NjMyMjd8MA&ixlib=rb-4.1.0&q=80&w=1080', imageHint: 'wheat' },
      { ...createMockPrice(1980, 0.08, 'Rice'), imageUrl: 'https://images.unsplash.com/photo-1635562985686-4f8bb9c0d3bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxyaWNlfGVufDB8fHx8MTc1ODQ2MzgwMnww&ixlib=rb-4.1.0&q=80&w=1080', imageHint: 'rice' },
      createMockPrice(2050, 0.12, 'Maize'),
      createMockPrice(2800, 0.15, 'Jowar'),
      createMockPrice(2600, 0.18, 'Bajra'),
      createMockPrice(3200, 0.2, 'Ragi'),
      createMockPrice(1800, 0.1, 'Barley'),
    ],
    Pulses: [
      createMockPrice(4800, 0.2, 'Gram'),
      { ...createMockPrice(9500, 0.25, 'Tur (Pigeon Pea)'), imageUrl: 'https://images.unsplash.com/photo-1690023852149-0c69ac74734f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHwlMjhQZWElMjl8ZW58MHx8fHwxNzU4NDY1NjU1fDA&ixlib=rb-4.1.0&q=80&w=1080', imageHint: 'pigeon pea' },
      { ...createMockPrice(8500, 0.3, 'Moong (Mung Bean)'), imageUrl: 'https://images.unsplash.com/photo-1600791439423-3b7c08502d60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtdW5nJTIwYmVhbnxlbnwwfHx8fDE3NTg1NTYwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080', imageHint: 'mung bean' },
      { ...createMockPrice(8200, 0.28, 'Urad (Black Gram)'), imageUrl: 'https://images.unsplash.com/photo-1603623696548-32f7bdd02844?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxibGFjayUyMGdyYW0lMjBiZWFuc3xlbnwwfHx8fDE3NTg1NTU5OTB8MA&ixlib=rb-4.1.0&q=80&w=1080', imageHint: 'black gram' },
      { ...createMockPrice(6500, 0.22, 'Lentil'), imageUrl: 'https://images.unsplash.com/photo-1582379963239-95292a454cfe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxsZW50aWx8ZW58MHx8fHwxNzU4NTU1MzYwfDA&ixlib=rb-4.1.0&q=80&w=1080', imageHint: 'lentils'},
    ],
    Oilseeds: [
      createMockPrice(5500, 0.18, 'Groundnut'),
      createMockPrice(4500, 0.2, 'Soybean'),
      createMockPrice(5200, 0.25, 'Rapeseed-Mustard'),
      createMockPrice(7500, 0.3, 'Sesamum (Sesame)'),
      createMockPrice(5800, 0.22, 'Sunflower'),
      createMockPrice(6200, 0.25, 'Safflower'),
      createMockPrice(6000, 0.2, 'Nigerseed'),
      createMockPrice(6400, 0.28, 'Castor'),
    ],
    'Cash Crops': [
      createMockPrice(5650, 0.2, 'Cotton'),
      createMockPrice(310, 0.1, 'Sugarcane'),
      createMockPrice(7500, 0.15, 'Coffee'),
      createMockPrice(140, 0.12, 'Tea'),
      createMockPrice(2500, 0.18, 'Jute'),
      createMockPrice(4500, 0.22, 'Tobacco'),
    ],
    Vegetables: [
      { ...createMockPrice(2500, 0.4, 'Tomato'), imageUrl: 'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxUb21hdG98ZW58MHx8fHwxNzU4NDY0MDM3fDA&ixlib=rb-4.1.0&q=80&w=1080', imageHint: 'tomato' },
      { ...createMockPrice(2200, 0.45, 'Brinjal (Eggplant)'), imageUrl: 'https://images.unsplash.com/photo-1605197378540-10ebaf6999e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxCcmluamFsJTIwJTI4RWdncGxhbnQlMjl8ZW58MHx8fHwxNzU4NDY0MDU1fDA&ixlib=rb-4.1.0&q=80&w=1080', imageHint: 'brinjal' },
      { ...createMockPrice(4000, 0.5, 'Chili'), imageUrl: 'https://images.unsplash.com/photo-1568661272228-22de33148f43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxjaGlsaSUyMHBlcHBlcnN8ZW58MHx8fHwxNzU4NTU0MzUxfDA&ixlib=rb-4.1.0&q=80&w=1080', imageHint: 'chili peppers' },
      { ...createMockPrice(2000, 0.35, 'Potato'), imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxwb3RhdG98ZW58MHx8fHwxNzU4NTU0MTgxfDA&ixlib=rb-4.1.0&q=80&w=1080', imageHint: 'potatoes' },
      createMockPrice(1800, 0.4, 'Onion'),
      createMockPrice(1500, 0.5, 'Cabbage'),
      createMockPrice(2800, 0.55, 'Cauliflower'),
      createMockPrice(3500, 0.6, 'Bitter Gourd'),
      createMockPrice(4500, 0.6, 'Okra (Lady\'s Finger)'),
    ],
    Fruits: [
      { ...createMockPrice(150, 0.3, 'Banana'), imageUrl: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxiYW5hbmF8ZW58MHx8fHwxNzU4NDYzODcwfDA&ixlib=rb-4.1.0&q=80&w=1080', imageHint: 'banana' },
      { ...createMockPrice(12000, 0.5, 'Dragon Fruit'), imageUrl: 'https://images.unsplash.com/photo-1623030235422-07f96401f5ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxkcmFnb24lMjBGcnVpdHxlbnwwfHx8fDE3NTg0NjM5NTF8MA&ixlib=rb-4.1.0&q=80&w=1080', imageHint: 'dragon-fruit'},
      createMockPrice(25000, 0.6, 'Avocado'),
    ],
    Spices: [
      createMockPrice(8000, 0.25, 'Turmeric'),
      createMockPrice(25000, 0.3, 'Cumin'),
      createMockPrice(7000, 0.28, 'Coriander'),
      createMockPrice(200000, 0.4, 'Saffron'),
    ]
  };
}


export const mockPesticides: Pesticide[] = [
    {
        id: 'pest-1',
        name: 'Propiconazole 25% EC',
        type: 'Fungicide',
        description: 'A broad-spectrum systemic fungicide for the control of a wide range of leaf and stem diseases in cereals, fruits, and vegetables.',
        price: 1200,
        unit: '1 Litre',
        imageUrl: 'https://picsum.photos/seed/product-bottle/300/300',
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
        imageUrl: 'https://picsum.photos/seed/agrochemical/300/300',
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
        imageUrl: 'https://picsum.photos/seed/chemical-can/300/300',
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
        imageUrl: 'https://picsum.photos/seed/farm-chemical/300/300',
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
        imageUrl: 'https://picsum.photos/seed/product-box-1/300/300',
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
        imageUrl: 'https://picsum.photos/seed/product-bag-2/300/300',
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
        imageUrl: 'https://picsum.photos/seed/product-can-3/300/300',
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
        imageUrl: 'https://picsum.photos/seed/growth-regulator/300/300',
        usage: {
            dosage: '250-500 ml per acre.',
            method: 'Apply at the flowering or boll formation stage in cotton.',
        },
        safetyNotes: ['Follow the recommended dosage strictly to avoid adverse effects on crop growth.', 'Store in a cool, dry place.'],
    }
];

    

    











    