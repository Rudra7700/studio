
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, Battery, Bot, Droplets, LocateFixed, Zap, Play, Scan, Orbit, CircleStop, Home, TestTube, Leaf, Bug, Sprout } from 'lucide-react';
import { mockDrones } from '@/lib/mock-data';
import type { Drone } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';

type DroneStatus = 'Idle' | 'Scanning' | 'Spraying' | 'Returning' | 'Charging' | 'Emergency' | 'Takeoff';

const statusInfo = {
  Idle: { icon: <CircleStop className="w-4 h-4" />, color: 'text-muted-foreground' },
  Scanning: { icon: <Scan className="w-4 h-4" />, color: 'text-blue-500' },
  Spraying: { icon: <Droplets className="w-4 h-4" />, color: 'text-yellow-500' },
  Returning: { icon: <Home className="w-4 h-4" />, color: 'text-purple-500' },
  Charging: { icon: <Zap className="w-4 h-4" />, color: 'text-green-500' },
  Emergency: { icon: <AlertCircle className="w-4 h-4" />, color: 'text-red-500' },
  Takeoff: { icon: <Orbit className="w-4 h-4" />, color: 'text-indigo-500' },
};

const sprayOptions = [
    { id: 'herbicide', label: 'Herbicide', description: 'e.g., Glyphosate, 2,4-D', icon: <TestTube className="w-5 h-5 text-red-500" /> },
    { id: 'pesticide', label: 'Pesticide', description: 'e.g., Malathion, Chlorpyrifos', icon: <Bug className="w-5 h-5 text-orange-500" /> },
    { id: 'fungicide', label: 'Fungicide', description: 'e.g., Copper Sulfate, Propiconazole', icon: <Leaf className="w-5 h-5 text-blue-500" /> },
    { id: 'fertilizer', label: 'Fertilizer', description: 'e.g., Urea, NPK blend', icon: <Sprout className="w-5 h-5 text-green-500" /> },
    { id: 'organic', label: 'Organic Pesticide', description: 'e.g., Neem Oil, Pyrethrin', icon: <Leaf className="w-5 h-5 text-green-700" /> },
];


export function DroneControl() {
  const [selectedDroneId, setSelectedDroneId] = useState(mockDrones[0].id);
  const [drone, setDrone] = useState<Drone | undefined>(mockDrones.find(d => d.id === selectedDroneId));
  const [status, setStatus] = useState<DroneStatus>('Idle');
  const [battery, setBattery] = useState(0);
  const [tank, setTank] = useState(0);
  const [isSprayModalOpen, setIsSprayModalOpen] = useState(false);
  const [selectedSpray, setSelectedSpray] = useState(sprayOptions[1].id);
  
  useEffect(() => {
    const selected = mockDrones.find(d => d.id === selectedDroneId);
    setDrone(selected);
    if(selected){
      setStatus(selected.status === 'Maintenance' ? 'Idle' : selected.status);
      setBattery(selected.batteryLevel);
      setTank(selected.tankLevel);
    }
  }, [selectedDroneId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (status === 'Scanning' || status === 'Spraying' || status === 'Returning' || status === 'Takeoff') {
      interval = setInterval(() => {
        setBattery((prev) => Math.max(0, prev - 1));
        if (status === 'Spraying') {
          setTank((prev) => Math.max(0, prev - 2));
        }
      }, 2000);
    }

    return () => clearInterval(interval);
  }, [status]);

  const handleAction = (newStatus: DroneStatus) => {
    if(drone?.status === 'Maintenance' || drone?.status === 'Charging') return;
    setStatus(newStatus);
    let duration = 5000;
    if(newStatus === 'Takeoff') duration = 3000;

    if (newStatus !== 'Idle' && newStatus !== 'Emergency') {
      setTimeout(() => {
        if(newStatus === 'Takeoff') setStatus('Idle')
        else setStatus('Returning');
        
        setTimeout(() => setStatus('Idle'), 5000);
      }, duration);
    }
  };
  
  const handleEmergencyStop = () => {
    setStatus('Emergency');
    setTimeout(() => {
      setStatus('Returning');
      setTimeout(() => setStatus('Idle'), 5000);
    }, 2000);
  }

  const handleSprayClick = () => {
    setIsSprayModalOpen(true);
  }

  const handleConfirmSpray = () => {
    setIsSprayModalOpen(false);
    handleAction('Spraying');
  }


  if (!drone) return <Card><CardHeader><CardTitle>No Drone Selected</CardTitle></CardHeader></Card>;
  
  const isBusy = status !== 'Idle' && status !== 'Charging' && status !== 'Emergency';
  const isDisabled = drone.status === 'Maintenance' || drone.status === 'Charging' || isBusy;

  return (
    <>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Drone Control</CardTitle>
         <Select value={selectedDroneId} onValueChange={setSelectedDroneId}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Drone" />
          </SelectTrigger>
          <SelectContent>
            {mockDrones.map(d => (
              <SelectItem key={d.id} value={d.id}>{d.model} ({d.id})</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center bg-card-foreground/5 p-3 rounded-lg">
          <span className="font-semibold">Status</span>
          <div className={cn("flex items-center gap-2 font-medium", statusInfo[status]?.color || 'text-muted-foreground')}>
            {statusInfo[status]?.icon || <Bot className="w-4 h-4" />}
            <span>{drone.status === 'Maintenance' ? 'Maintenance' : status}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium flex items-center gap-1"><Battery className="w-4 h-4"/> Battery</span>
            <span>{battery}%</span>
          </div>
          <Progress value={battery} />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium flex items-center gap-1"><Droplets className="w-4 h-4"/> Tank Level</span>
            <span>{tank}%</span>
          </div>
          <Progress value={tank} />
        </div>
        <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => handleAction('Takeoff')} disabled={isDisabled}><Play className="mr-2 h-4 w-4"/> Takeoff</Button>
            <Button variant="outline" onClick={() => handleAction('Scanning')} disabled={isDisabled}><Scan className="mr-2 h-4 w-4"/> Scan</Button>
            <Button variant="outline" onClick={handleSprayClick} disabled={isDisabled}><Orbit className="mr-2 h-4 w-4"/> Spray</Button>
            <Button variant="outline" onClick={() => handleAction('Returning')} disabled={isDisabled}><Home className="mr-2 h-4 w-4"/> Return</Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="destructive" className="w-full" onClick={handleEmergencyStop} disabled={status === 'Emergency'}>
          <AlertCircle className="mr-2 h-4 w-4" /> Emergency Stop
        </Button>
      </CardFooter>
    </Card>
    <Dialog open={isSprayModalOpen} onOpenChange={setIsSprayModalOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Select Spray Type</DialogTitle>
                <DialogDescription>Choose the substance to spray on the field.</DialogDescription>
            </DialogHeader>
            <RadioGroup value={selectedSpray} onValueChange={setSelectedSpray} className="grid gap-3">
                {sprayOptions.map((option) => (
                     <Label key={option.id} htmlFor={option.id} className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-accent hover:text-accent-foreground has-[:checked]:bg-accent has-[:checked]:text-accent-foreground">
                        <RadioGroupItem value={option.id} id={option.id} className="sr-only" />
                        {option.icon}
                        <div className="flex-1">
                            <p className="font-semibold">{option.label}</p>
                            <p className="text-xs">{option.description}</p>
                        </div>
                    </Label>
                ))}
            </RadioGroup>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsSprayModalOpen(false)}>Cancel</Button>
                <Button onClick={handleConfirmSpray}>Confirm & Spray</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    </>
  );
}
