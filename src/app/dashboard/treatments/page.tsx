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
import { mockTreatments, mockFields } from '@/lib/mock-data';
import { FileDown } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Treatment } from '@/lib/types';

const statusStyles: Record<Treatment['status'], string> = {
  Scheduled: 'bg-blue-500/20 text-blue-700 border-blue-500/30',
  'In Progress': 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30',
  Completed: 'bg-green-500/20 text-green-700 border-green-500/30',
  Cancelled: 'bg-red-500/20 text-red-700 border-red-500/30',
};

export default function TreatmentsPage() {
  const treatments = [...mockTreatments].sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime());

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Treatment History</CardTitle>
            <CardDescription>A log of all treatments for your fields.</CardDescription>
        </div>
        <Button variant="outline"><FileDown className="mr-2 h-4 w-4"/> Export CSV</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Field</TableHead>
              <TableHead>Disease Detected</TableHead>
              <TableHead>Treatment Plan</TableHead>
              <TableHead>Drone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {treatments.map((treatment) => {
                const field = mockFields.find(f => f.id === treatment.fieldId);
                return (
                    <TableRow key={treatment.id}>
                        <TableCell>
                            <div className="font-medium">{field?.name || 'Unknown Field'}</div>
                            <div className="text-sm text-muted-foreground">{field?.cropType}</div>
                        </TableCell>
                        <TableCell>{treatment.disease}</TableCell>
                        <TableCell className="max-w-xs truncate">{treatment.treatment}</TableCell>
                        <TableCell>{treatment.executedBy}</TableCell>
                        <TableCell>
                            <Badge variant="outline" className={cn(statusStyles[treatment.status])}>{treatment.status}</Badge>
                        </TableCell>
                         <TableCell className="text-right">{format(new Date(treatment.scheduledDate), 'PP')}</TableCell>
                    </TableRow>
                )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
