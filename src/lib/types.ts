

export type Farmer = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  fields: string[]; // array of field IDs
  phone?: string;
};

export type Field = {
  id: string;
  name:string;
  farmerId: string;
  cropType: 'Corn' | 'Wheat' | 'Soybean' | 'Other' | 'Rice' | 'Maize' | 'Millets' | 'Pulses' | 'Gram' | 'Sugarcane' | 'Cotton' | 'Jute' | 'Oilseeds' | 'Tea' | 'Coffee' | 'Rubber' | 'Coconut' | 'Fruits' | 'Vegetables' | 'Spices' | 'Medicinal Plants' | 'Mango' | 'Banana' | 'Grapes' | 'Potato' | 'Tomato';
  gpsCoordinates: {
    lat: number;
    lng: number;
  };
  boundary: { lat: number; lng: number }[];
  healthStatus: 'Healthy' | 'Mild' | 'Severe' | 'Unknown';
  imageUrl: string;
  imageHint: string;
};

export type Drone = {
  id: string;
  model: string;
  status: 'Idle' | 'Scanning' | 'Spraying' | 'Returning' | 'Charging' | 'Maintenance';
  batteryLevel: number; // percentage
  tankLevel: number; // percentage of pesticide
  location: {
    lat: number;
    lng: number;
  };
};

export type Treatment = {
  id: string;
  fieldId: string;
  disease: string;
  treatment: string;
  scheduledDate: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  executedBy: string; // drone ID
};

export type SensorData = {
  soilMoisture: number; // percentage
  humidity: number; // percentage
  temperature: number; // Celsius
};

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
};

export type MandiPrice = {
    currentPrice: number;
    nearbyMandis: { mandiName: string; price: number }[];
    priceTrend: { date: string; price: number }[];
    priceAnalysis: string;
}

export type MandiPriceCardData = {
  name: string;
  mandi: string;
  price: number;
  change: number;
  percentChange: number;
  imageUrl: string;
  imageHint: string;
};


export type Pesticide = {
    id: string;
    name: string;
    type: 'Fungicide' | 'Insecticide' | 'Herbicide' | 'Other';
    description: string;
    price: number;
    unit: string;
    imageUrl: string;
    usage: {
        dosage: string;
        method: string;
    };
    safetyNotes: string[];
}

export type Notification = {
    id: string;
    type: 'mandiPrice' | 'pesticide' | 'field' | 'general' | 'treatment';
    title: string;
    description: string;
    timestamp: string;
    icon: string;
    read: boolean;
};

export type Inventory = {
    quantity: number;
    unit: string;
};

export interface TelemetryData {
    altitude: number;
    speed: number;
    battery: number;
    tankLevel: number;
    connection: 'Strong' | 'Weak' | 'Connected';
    gps: string;
}

export type Challenge = {
  id: string;
  title: string;
  description: string;
  points: number;
  type: 'daily' | 'weekly' | 'seasonal';
  isCompleted: boolean;
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  isUnlocked: boolean;
};

export type LeaderboardEntry = {
  rank: number;
  farmerId: string;
  points: number;
};

export type Wallet = {
  currentBalance: number;
  totalIncome: number;
  totalExpenses: number;
};

export type Transaction = {
  id: string;
  date: string;
  description: string;
  category?: string;
  amount: number;
  type: 'income' | 'expense';
};
