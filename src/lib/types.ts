export type Farmer = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  fields: string[]; // array of field IDs
};

export type Field = {
  id: string;
  name:string;
  farmerId: string;
  cropType: 'Corn' | 'Wheat' | 'Soybean' | 'Other';
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
