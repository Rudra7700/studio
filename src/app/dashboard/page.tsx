import { Droplets, Map, Scan, Tractor } from 'lucide-react';
import { StatsCard } from '@/components/stats-card';
import { DroneControl } from '@/components/drone-control';
import { AiAssistant } from '@/components/ai-assistant';
import { FieldOverview } from '@/components/field-overview';
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
import { mockTreatments } from '@/lib/mock-data';
import { format } from 'date-fns';

export default function DashboardPage() {
    const upcomingTreatments = mockTreatments.filter(t => t.status === 'Scheduled').slice(0, 3);
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <StatsCard 
            title="Total Fields" 
            value="3" 
            icon={<Map className="h-4 w-4" />}
            description="2 active, 1 needs attention"
        />
        <StatsCard 
            title="Active Drones" 
            value="1 / 3" 
            icon={<Tractor className="h-4 w-4" />}
            description="Drone-001 is idle"
        />
        <StatsCard 
            title="Scheduled Sprays" 
            value="1" 
            icon={<Droplets className="h-4 w-4" />}
            description="For West Wheat Patch"
        />
        <StatsCard 
            title="Last Scan" 
            value="2 hours ago" 
            icon={<Scan className="h-4 w-4" />}
            description="No new issues detected"
        />
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
                <DroneControl />
                <FieldOverview />
            </div>
             <Card>
              <CardHeader>
                <CardTitle>Upcoming Treatments</CardTitle>
                <CardDescription>
                  Scheduled treatments for your fields.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Field</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Disease</TableHead>
                      <TableHead className="text-right">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                     {upcomingTreatments.map(treatment => (
                        <TableRow key={treatment.id}>
                            <TableCell>
                                <div className="font-medium">
                                {
                                    mockTreatments.find(t => t.id === treatment.id)?.fieldId === 'field-2' ? 'West Wheat Patch' : 'Soybean Central'
                                }
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge className="text-xs" variant="outline">
                                {treatment.status}
                                </Badge>
                            </TableCell>
                            <TableCell>{treatment.disease}</TableCell>
                            <TableCell className="text-right">
                                {format(new Date(treatment.scheduledDate), 'PPP')}
                            </TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
        </div>
        <div className="xl:col-span-1">
          <AiAssistant />
        </div>
      </div>
    </>
  );
}
