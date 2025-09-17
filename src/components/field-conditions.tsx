'use client';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Droplets, Thermometer, Wind } from "lucide-react";
import { mockSensorData } from "@/lib/mock-data";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";

export function FieldConditions() {
    const [sensorData, setSensorData] = useState<typeof mockSensorData | null>(null);

    useEffect(() => {
        // Simulate fetching data
        const timer = setTimeout(() => {
            setSensorData(mockSensorData);
        }, 1500);

        // Simulate live updates
        const interval = setInterval(() => {
             setSensorData(prevData => {
                if(!prevData) return prevData;
                return {
                    soilMoisture: Math.max(20, Math.min(80, prevData.soilMoisture + (Math.random() - 0.5) * 2)),
                    humidity: Math.max(40, Math.min(90, prevData.humidity + (Math.random() - 0.5) * 3)),
                    temperature: Math.max(15, Math.min(35, prevData.temperature + (Math.random() - 0.5))),
                }
            })
        }, 30000);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, []);

    const dataItems = sensorData ? [
        {
            icon: <Droplets className="w-5 h-5 text-blue-500" />,
            label: "Humidity",
            value: `${sensorData.humidity.toFixed(0)}%`,
        },
        {
            icon: <Wind className="w-5 h-5 text-gray-500" />,
            label: "Soil Moisture",
            value: `${sensorData.soilMoisture.toFixed(0)}%`,
        },
        {
            icon: <Thermometer className="w-5 h-5 text-red-500" />,
            label: "Temperature",
            value: `${sensorData.temperature.toFixed(1)}°C`,
        },
    ] : [];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Field Conditions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                    {!sensorData ? (
                        <>
                            <SensorSkeleton />
                            <SensorSkeleton />
                            <SensorSkeleton />
                        </>
                    ) : (
                        dataItems.map(item => (
                            <div key={item.label} className="flex flex-col items-center space-y-2">
                                <div className="p-3 bg-card-foreground/5 rounded-full">
                                    {item.icon}
                                </div>
                                <p className="text-sm text-muted-foreground">{item.label}</p>
                                <p className="text-lg font-bold">{item.value}</p>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

const SensorSkeleton = () => (
    <div className="flex flex-col items-center space-y-2">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-6 w-12" />
    </div>
)
