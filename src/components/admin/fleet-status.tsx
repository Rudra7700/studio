import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockDrones } from '@/lib/mock-data';
import { Tractor, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Drone } from '@/lib/types';
import { Progress } from '../ui/progress';

const statusStyles: Record<Drone['status'], string> = {
  Idle: 'bg-gray-500/20 text-gray-700 border-gray-500/30',
  Scanning: 'bg-blue-500/20 text-blue-700 border-blue-500/30',
  Spraying: 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30',
  Returning: 'bg-purple-500/20 text-purple-700 border-purple-500/30',
  Charging: 'bg-green-500/20 text-green-700 border-green-500/30',
  Maintenance: 'bg-orange-500/20 text-orange-700 border-orange-500/30',
};


export function FleetStatus() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Drone Fleet Status</CardTitle>
        <CardDescription>Monitor and manage all drones in the system.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Drone ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Battery</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockDrones.map((drone) => (
              <TableRow key={drone.id}>
                <TableCell>
                  <div className="font-medium flex items-center gap-2">
                    <Tractor className="h-4 w-4 text-muted-foreground"/> 
                    {drone.id}
                  </div>
                  <div className="text-sm text-muted-foreground ml-6">{drone.model}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn(statusStyles[drone.status])}>{drone.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={drone.batteryLevel} className="w-24 h-2" />
                    <span className="text-sm text-muted-foreground">{drone.batteryLevel}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm"><Wrench className="h-3 w-3 mr-2"/> Schedule Maintenance</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
