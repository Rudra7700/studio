
'use client';
import { Badge } from "./ui/badge";
import { Battery, CircleDot, Gauge, MapPin, Signal } from "lucide-react";

export interface TelemetryData {
    altitude: number;
    speed: number;
    battery: number;
    tankLevel: number;
    connection: 'Strong' | 'Weak' | 'Connected';
    gps: string;
}

interface DroneTelemetryProps {
    data: TelemetryData;
}

export function DroneTelemetry({ data }: DroneTelemetryProps) {
    return (
        <div className="absolute top-4 left-4 right-4 z-20 grid grid-cols-2 md:grid-cols-4 gap-2 text-white">
            <TelemetryCard icon={<Battery />} label="Battery" value={`${data.battery}%`} />
            <TelemetryCard icon={<CircleDot />} label="Altitude" value={`${data.altitude} m`} />
            <TelemetryCard icon={<Gauge />} label="Speed" value={`${data.speed} km/h`} />
            <TelemetryCard icon={<MapPin />} label="GPS" value={data.gps} />
             <TelemetryCard icon={<Signal />} label="Connection" value={data.connection} />
        </div>
    );
}

interface TelemetryCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
}

function TelemetryCard({ icon, label, value }: TelemetryCardProps) {
    return (
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-2 flex items-center gap-2">
            <div className="text-primary">{icon}</div>
            <div>
                <p className="text-xs text-muted-foreground font-semibold">{label}</p>
                <p className="text-sm font-bold">{value}</p>
            </div>
        </div>
    );
}
