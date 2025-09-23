
import type { Farmer, Field, Drone, Treatment, SensorData, MandiPrice, Pesticide, MandiPriceCardData, Notification, Inventory, Challenge, Badge, LeaderboardEntry, Wallet, Transaction } from './types';
import { subDays, format, subMinutes, subHours } from 'date-fns';

export const mockFarmers: Farmer[] = [
  {
    id: 'farmer-1',
    name: 'Rajesh Kumar',
    email: 'rajesh.k@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1590682680695-43b964a3ae17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMXx8ZmFybWVyfGVufDB8fHx8MTc1ODU1OTkxM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    fields: ['field-1', 'field-2'],
  },
  {
    id: 'farmer-2',
    name: 'Anjali Sharma',
    email: 'anjali.s@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1617852629427-043357519965?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBmYXJtZXIlMjB3b21hbnxlbnwwfHx8fDE3NTg1NTgzODh8MA&ixlib.rb-4.1.0&q=80&w=1080',
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
    imageUrl: 'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxjcm9wJTIwZmllbGR8ZW58MHx8fHwxNzU4NDY2NjE5fDA&ixlib=rb-4.1.0&q=80&w=1080',
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
    imageUrl: 'https://images.unsplash.com/photo-1595976281013-8024ecc02575?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMnx8d2hlYXQlMjBmaWVsZHxlbnwwfHx8fDE3NTg0NjY3MDd8MA&ixlib=rb-4.1.0&q=80&w=1080',
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
    imageUrl: 'https://images.unsplash.com/photo-1665030996763-ac0d56a956f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyMHx8cmljZSUyMHBhZGR5fGVufDB8fHx8MTc1ODQ2NjkxNHww&ixlib.rb-4.1.0&q=80&w=1080',
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
      { ...createMockPrice(2050, 0.12, 'Maize'), imageUrl: 'https://images.unsplash.com/photo-1649251037465-72c9d378acb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxNYWl6ZXxlbnwwfHx8fDE3NTg2MzMxODV8MA&ixlib.rb-4.1.0&q=80&w=1080', imageHint: 'maize field' },
      { ...createMockPrice(2800, 0.15, 'Jowar'), imageUrl: 'https://images.unsplash.com/photo-1666987570506-f8c3e05b6c58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxqb3dhciUyMGNyb3B8ZW58MHx8fHwxNzU4NTYzOTUxfDA&ixlib.rb-4.1.0&q=80&w=1080', imageHint: 'sorghum field' },
      { ...createMockPrice(2600, 0.18, 'Bajra'), imageUrl: 'https://images.unsplash.com/photo-1708449094139-dd5cd2dd61ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxNXx8QmFqcmElMjBjcm9wfGVufDB8fHx8MTc1ODYzMzQ5N3ww&ixlib.rb-4.1.0&q=80&w=1080', imageHint: 'pearl millet' },
      { ...createMockPrice(3200, 0.2, 'Ragi'), imageUrl: 'https://images.unsplash.com/photo-1653580524515-77b19c176b88?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxSYWdpfGVufDB8fHx8MTc1ODYzMzc5Nnww&ixlib.rb-4.1.0&q=80&w=1080', imageHint: 'finger millet'},
      { ...createMockPrice(1800, 0.1, 'Barley'), imageUrl: 'https://images.unsplash.com/photo-1437252611977-07f74518abd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxCYXJsZXl8ZW58MHx8fHwxNzU4NjMzOTM1fDA&ixlib.rb-4.1.0&q=80&w=1080', imageHint: 'barley field' },
    ],
    Pulses: [
      { ...createMockPrice(4800, 0.2, 'Gram'), imageUrl: 'https://images.unsplash.com/photo-1612869538502-b5baa439abd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxHcmFtfGVufDB8fHx8MTc1ODYzNDE0MHww&ixlib.rb-4.1.0&q=80&w=1080', imageHint: 'chickpeas' },
      { ...createMockPrice(9500, 0.25, 'Tur (Pigeon Pea)'), imageUrl: 'https://images.unsplash.com/photo-1690023852149-0c69ac74734f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHwlMjhQZWElMjl8ZW58MHx8fHwxNzU4NDY1NjU1fDA&ixlib.rb-4.1.0&q=80&w=1080', imageHint: 'pigeon pea' },
      { ...createMockPrice(8500, 0.3, 'Moong (Mung Bean)'), imageUrl: 'https://images.unsplash.com/photo-1694679671688-3d9bb5e77f37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxNb29uZyUyMHxlbnwwfHx8fDE3NTg0NjU4NTF8MA&ixlib.rb-4.1.0&q=80&w=1080', imageHint: 'mung bean' },
      { ...createMockPrice(8200, 0.28, 'Urad (Black Gram)'), imageUrl: 'https://images.unsplash.com/photo-1563117063-ad38230557bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxCbGFjayUyMEdyYW18ZW58MHx8fHwxNzU4NDY1NzY2fDA&ixlib.rb-4.1.0&q=80&w=1080', imageHint: 'black gram' },
      { ...createMockPrice(6500, 0.22, 'Lentil'), imageUrl: 'https://images.unsplash.com/photo-1614373532201-c40b993f0013?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxMZW50aWx8ZW58MHx8fHwxNzU4NjM0Mjc1fDA&ixlib.rb-4.1.0&q=80&w=1080', imageHint: 'lentils'},
    ],
    Oilseeds: [
      { ...createMockPrice(5500, 0.18, 'Groundnut'), imageUrl: 'https://images.unsplash.com/photo-1694654359031-e2db00bd0e93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxHcm91bmRudXR8ZW58MHx8fHwxNzU4NjM0NDU1fDA&ixlib.rb-4.1.0&q=80&w=1080', imageHint: 'peanuts' },
      { ...createMockPrice(4500, 0.2, 'Soybean'), imageUrl: 'https://images.unsplash.com/photo-1639843606783-b2f9c50a7468?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzb3liZWFufGVufDB8fHx8MTc1ODYzNDYxMnww&ixlib.rb-4.1.0&q=80&w=1080', imageHint: 'soybean field' },
      { ...createMockPrice(5200, 0.25, 'Rapeseed-Mustard'), imageUrl: 'https://images.unsplash.com/photo-1529450704944-d7d1059f71c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtdXN0YXJkJTIwZmllbGR8ZW58MHx8fHwxNzU4NzEwMDQ3fDA&ixlib.rb-4.1.0&q=80&w=1080', imageHint: 'mustard field' },
      { ...createMockPrice(7500, 0.3, 'Sesamum (Sesame)'), imageUrl: 'https://images.unsplash.com/photo-1562034509-3c8d71249b6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzZXNhbWUlMjBzZWVkc3xlbnwwfHx8fDE3NTg3MTAwODd8MA&ixlib.rb-4.1.0&q=80&w=1080', imageHint: 'sesame seeds' },
      { ...createMockPrice(5800, 0.22, 'Sunflower'), imageUrl: 'https://images.unsplash.com/photo-1596708398933-281a8a25c60e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzdW5mbG93ZXIlMjBmaWVsZHxlbnwwfHx8fDE3NTg3MTAxMjN8MA&ixlib.rb-4.1.0&q=80&w=1080', imageHint: 'sunflower field' },
      { ...createMockPrice(6200, 0.25, 'Safflower'), imageUrl: 'https://images.unsplash.com/photo-1567675440751-22e70e9b9d62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzYWZmbG93ZXJ8ZW58MHx8fHwxNzU4NzEwMTY0fDA&ixlib.rb-4.1.0&q=80&w=1080', imageHint: 'safflower' },
      { ...createMockPrice(6000, 0.2, 'Nigerseed'), imageUrl: 'https://images.unsplash.com/photo-1563220098-903960411342?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxuaWdlciUyMHNlZWR8ZW58MHx8fHwxNzU4NzEwMjAyfDA&ixlib.rb-4.1.0&q=80&w=1080', imageHint: 'niger seed' },
      { ...createMockPrice(6400, 0.28, 'Castor'), imageUrl: 'https://images.unsplash.com/photo-1627541242337-97592a404c06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjYXN0b3IlMjBiZWFufGVufDB8fHx8MTc1ODcxMDI0M3ww&ixlib.rb-4.1.0&q=80&w=1080', imageHint: 'castor bean' },
    ],
    'Cash Crops': [
      {...createMockPrice(5650, 0.2, 'Cotton'), imageUrl: 'https://images.unsplash.com/photo-1633873972250-e69cd8b5e31c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxjb3R0b258ZW58MHx8fHwxNzU4NDY4ODcxfDA&ixlib.rb-4.1.0&q=80&w=1080', imageHint: 'cotton'},
      {...createMockPrice(310, 0.1, 'Sugarcane'), imageUrl: 'https://images.unsplash.com/photo-1730488636376-3bbb36aa5eb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxzdWdhcmNhbmV8ZW58MHx8fHwxNzU4NDY5MTI3fDA&ixlib.rb-4.1.0&q=80&w=1080', imageHint: 'sugarcane field'},
      { ...createMockPrice(7500, 0.15, 'Coffee'), imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBiZWFuc3xlbnwwfHx8fDE3NTg3MTAzMTN8MA&ixlib.rb-4.1.0&q=80&w=1080', imageHint: 'coffee beans' },
      { ...createMockPrice(140, 0.12, 'Tea'), imageUrl: 'https://images.unsplash.com/photo-1597318181315-fe242c8834a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx0ZWElMjBwbGFudGF0aW9ufGVufDB8fHx8MTc1ODcxMDM1Mnww&ixlib.rb-4.1.0&q=80&w=1080', imageHint: 'tea plantation' },
      { ...createMockPrice(2500, 0.18, 'Jute'), imageUrl: 'https://images.unsplash.com/photo-1627830338870-7a0e3b6d2745?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxqdXRlJTIwZmlicmVzfGVufDB8fHx8MTc1ODcxMDM5MXww&ixlib.rb-4.1.0&q=80&w=1080', imageHint: 'jute fibres' },
      { ...createMockPrice(4500, 0.22, 'Tobacco'), imageUrl: 'https://images.unsplash.com/photo-1599819198694-ad3f80164673?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx0b2JhY2NvJTIwbGVhdmVzfGVufDB8fHx8MTc1ODcxMDQzNnww&ixlib.rb-4.1.0&q=80&w=1080', imageHint: 'tobacco leaves' },
    ],
    Vegetables: [
      { ...createMockPrice(2500, 0.4, 'Tomato'), imageUrl: 'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxUb21hdG98ZW58MHx8fHwxNzU4NDY0MDM3fDA&ixlib.rb-4.1.0&q=80&w=1080', imageHint: 'tomato' },
      { ...createMockPrice(2200, 0.45, 'Brinjal (Eggplant)'), imageUrl: 'https://images.unsplash.com/photo-1605197378540-10ebaf6999e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxCcmluamFsJTIwJTI4RWdncGxhbnQlMjl8ZW58MHx8fHwxNzU4NDY0MDU1fDA&ixlib.rb-4.1.0&q=80&w=1080', imageHint: 'brinjal' },
      { ...createMockPrice(4000, 0.5, 'Chili'), imageUrl: 'https://images.unsplash.com/photo-1602237514002-c2d8ae2da393?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxjaGlsaXxlbnwwfHx8fDE3NTg2MzU5NTR8MA&ixlib.rb-4.1.0&q=80&w=1080', imageHint: 'chili peppers' },
      { ...createMockPrice(2000, 0.35, 'Potato'), imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxwb3RhdG98ZW58MHx8fHwxNzU4NTU0MTgxfDA&ixlib.rb-4.1.0&q=80&w=1080', imageHint: 'potatoes' },
      { ...createMockPrice(1800, 0.4, 'Onion'), imageUrl: 'https://images.unsplash.com/photo-1642582037312-9b9639be89e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxPbmlvbnxlbnwwfHx8fDE3NTg2MzU3NjN8MA&ixlib.rb-4.1.0&q=80&w=1080', imageHint: 'onions' },
      { ...createMockPrice(1500, 0.5, 'Cabbage'), imageUrl: 'https://images.unsplash.com/photo-1652860213441-6622f9fec77f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxDYWJiYWdlfGVufDB8fHx8MTc1ODYzNTQwNnww&ixlib.rb-4.1.0&q=80&w=1080', imageHint: 'cabbage' },
      { ...createMockPrice(2800, 0.55, 'Cauliflower'), imageUrl: 'https://images.unsplash.com/photo-1602163923086-455b597c5513?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjYXVsaWZsb3dlcnxlbnwwfHx8fDE3NTg3MTA1Nzh8MA&ixlib.rb-4.1.0&q=80&w=1080', imageHint: 'cauliflower' },
      { ...createMockPrice(3500, 0.6, 'Bitter Gourd'), imageUrl: 'https://images.unsplash.com/photo-1605792281898-70781d431fd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxiaXR0ZXIlMjBnb3VyZHxlbnwwfHx8fDE3NTg3MTA2MTJ8MA&ixlib.rb-4.1.0&q=80&w=1080', imageHint: 'bitter gourd' },
      { ...createMockPrice(4500, 0.6, 'Okra (Lady\'s Finger)'), imageUrl: 'https://images.unsplash.com/photo-1549491612-257529452b47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxvcmthfGVufDB8fHx8MTc1ODcxMDY0NHww&ixlib.rb-4.1.0&q=80&w=1080', imageHint: 'okra' },
    ],
    Fruits: [
      { ...createMockPrice(150, 0.3, 'Banana'), imageUrl: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxiYW5hbmF8ZW58MHx8fHwxNzU4NDYzODcwfDA&ixlib.rb-4.1.0&q=80&w=1080', imageHint: 'banana' },
      { ...createMockPrice(12000, 0.5, 'Dragon Fruit'), imageUrl: 'https://images.unsplash.com/photo-1623030235422-07f96401f5ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxkcmFnb24lMjBGcnVpdHxlbnwwfHx8fDE3NTg0NjM5NTF8MA&ixlib.rb-4.1.0&q=80&w=1080', imageHint: 'dragon-fruit'},
      { ...createMockPrice(25000, 0.6, 'Avocado'), imageUrl: 'https://cdn.britannica.com/72/170772-050-D52BF8C2/Avocado-fruits.jpg', imageHint: 'avocado' },
    ],
    Spices: [
      { ...createMockPrice(8000, 0.25, 'Turmeric'), imageUrl: 'https://images.unsplash.com/photo-1666818398897-381dd5eb9139?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxUdXJtZXJpY3xlbnwwfHx8fDE3NTg2MzYxMzh8MA&ixlib.rb-4.1.0&q=80&w=1080', imageHint: 'turmeric root' },
      { ...createMockPrice(25000, 0.3, 'Cumin'), imageUrl: 'https://images.unsplash.com/photo-1609324160773-7f3cfacc27ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxDdW1pbnxlbnwwfHx8fDE3NTg2MzY1ODR8MA&ixlib.rb-4.1.0&q=80&w=1080', imageHint: 'cumin seeds' },
      { ...createMockPrice(7000, 0.28, 'Coriander'), imageUrl: 'https://images.unsplash.com/photo-1604859951139-5517b189a66d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxcorJpYW5kZXIlMjBzZWVkc3xlbnwwfHx8fDE3NTg3MTA3ODR8MA&ixlib.rb-4.1.0&q=80&w=1080', imageHint: 'coriander seeds' },
      { ...createMockPrice(200000, 0.4, 'Saffron'), imageUrl: 'https://images.unsplash.com/photo-1656568866961-03e9dcc0fbc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxTYWZmcm9ufGVufDB8fHx8MTc1ODYzNjc4NHww&ixlib.rb-4.1.0&q=80&w=1080', imageHint: 'saffron threads' },
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

export const mockNotifications: Notification[] = [
    {
        id: 'notif-1',
        type: 'mandiPrice',
        title: 'New Mandi Price for Wheat',
        description: 'Wheat prices have increased by 3% in the Delhi Mandi. Current price: ₹2150/quintal.',
        timestamp: `${format(subMinutes(new Date(), 5), 'h:mm a')}`,
        icon: 'mandiPrice',
        read: false,
    },
    {
        id: 'notif-2',
        type: 'pesticide',
        title: 'Pesticide Stock Low',
        description: 'Your stock of Propiconazole 25% EC is running low. Consider reordering.',
        timestamp: `${format(subMinutes(new Date(), 22), 'h:mm a')}`,
        icon: 'pesticide',
        read: false,
    },
    {
        id: 'notif-3',
        type: 'field',
        title: 'Scan Complete: West Wheat Patch',
        description: 'AI analysis detected early signs of Wheat Rust. A treatment plan is recommended.',
        timestamp: `${format(subHours(new Date(), 1), 'h:mm a')}`,
        icon: 'field',
        read: true,
    },
    {
        id: 'notif-4',
        type: 'treatment',
        title: 'Treatment Executed',
        description: 'Fungicide application for Rice Blast on Central Rice Paddy has been successfully completed.',
        timestamp: `${format(subHours(new Date(), 3), 'h:mm a')}`,
        icon: 'treatment',
        read: true,
    },
    {
        id: 'notif-5',
        type: 'general',
        title: 'Pest Alert: Locust Swarm',
        description: 'A locust swarm has been reported 50km from your area. Monitor fields closely.',
        timestamp: `${format(subHours(new Date(), 8), 'PP')}`,
        icon: 'general',
        read: true,
    }
];

export const mockInventory: Record<string, Inventory> = {
    'Wheat': { quantity: 150, unit: 'quintals' },
    'Rice': { quantity: 200, unit: 'quintals' },
    'Maize': { quantity: 120, unit: 'quintals' },
    'Tur (Pigeon Pea)': { quantity: 80, unit: 'quintals' },
    'Moong (Mung Bean)': { quantity: 50, unit: 'quintals' },
    'Urad (Black Gram)': { quantity: 60, unit: 'quintals' },
    'Tomato': { quantity: 30, unit: 'quintals' },
    'Potato': { quantity: 250, unit: 'quintals' },
    'Avocado': { quantity: 5, unit: 'quintals' },
    'Cotton': { quantity: 100, unit: 'quintals' },
    'Sugarcane': { quantity: 500, unit: 'quintals' },
};
    
export const mockChallenges: Challenge[] = [
    {
        id: 'task-1',
        title: 'Record Soil Moisture',
        description: 'Check the soil moisture in your North Corn Field and log the data.',
        points: 10,
        type: 'daily',
        isCompleted: true,
    },
    {
        id: 'task-2',
        title: 'Inspect for Pests',
        description: 'Inspect 10 wheat plants for any signs of pests.',
        points: 15,
        type: 'daily',
        isCompleted: false,
    },
    {
        id: 'task-3',
        title: 'Log Rainfall',
        description: 'Log today\'s rainfall amount in the app.',
        points: 5,
        type: 'daily',
        isCompleted: false,
    },
    {
        id: 'quest-1',
        title: 'Soil Accuracy',
        description: 'Achieve 90% soil moisture accuracy across all zones this week.',
        points: 100,
        type: 'weekly',
        isCompleted: false,
    }
];

export const mockBadges: Badge[] = [
    {
        id: 'badge-1',
        name: 'Soil Expert',
        description: 'Log soil data 100 times',
        icon: 'Sprout',
        isUnlocked: true,
    },
    {
        id: 'badge-2',
        name: 'Pest Detective',
        description: 'Identify 50 pest instances',
        icon: 'Bug',
        isUnlocked: true,
    },
    {
        id: 'badge-3',
        name: 'Water Manager',
        description: 'Maintain optimal irrigation for 30 days',
        icon: 'Droplets',
        isUnlocked: false,
    },
    {
        id: 'badge-4',
        name: 'Sustainability Champion',
        description: 'Reduce chemical usage by 25%',
        icon: 'Recycle',
        isUnlocked: false,
    },
    {
        id: 'badge-5',
        name: 'Top Scout',
        description: 'Complete the most field entries in a single day',
        icon: 'Eye',
        isUnlocked: false,
    },
    {
        id: 'badge-6',
        name: 'Community Helper',
        description: 'Help 10 other farmers in the community forum',
        icon: 'Users',
        isUnlocked: false,
    }
];

export const mockLeaderboard: LeaderboardEntry[] = [
    { rank: 1, farmerId: 'farmer-1', points: 2450 },
    { rank: 2, farmerId: 'farmer-2', points: 2180 },
    { rank: 3, farmerId: 'farmer-3-mock', points: 1950 },
    { rank: 4, farmerId: 'farmer-4-mock', points: 1820 },
    { rank: 5, farmerId: 'farmer-5-mock', points: 1700 },
];    

export const mockWallet: Wallet = {
    currentBalance: 78550,
    totalIncome: 112500,
    totalExpenses: 33950,
};

export const mockTransactions: Transaction[] = [
    {
        id: 'tx-1',
        date: subDays(new Date(), 2).toISOString(),
        description: 'Sale of 50 quintals of Wheat',
        category: 'Crop Sale',
        amount: 112500,
        type: 'income',
    },
    {
        id: 'tx-2',
        date: subDays(new Date(), 5).toISOString(),
        description: 'Purchase of Propiconazole',
        category: 'Pesticides',
        amount: 2400,
        type: 'expense',
    },
    {
        id: 'tx-3',
        date: subDays(new Date(), 10).toISOString(),
        description: 'Drone-001 Maintenance',
        category: 'Equipment',
        amount: 5000,
        type: 'expense',
    },
    {
        id: 'tx-4',
        date: subDays(new Date(), 12).toISOString(),
        description: 'Purchase of seeds',
        category: 'Supplies',
        amount: 15000,
        type: 'expense',
    },
    {
        id: 'tx-5',
        date: subDays(new Date(), 25).toISOString(),
        description: 'Fuel for tractor',
        category: 'Operations',
        amount: 3500,
        type: 'expense',
    },
];

    











    

    





    


    

    

    

    







    

    

    

    

    


    





    
