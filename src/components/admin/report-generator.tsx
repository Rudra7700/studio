'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, FileDown } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import React from 'react';

export function ReportGenerator() {
    const [date, setDate] = React.useState<Date>();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Report Generator</CardTitle>
                <CardDescription>Generate and download system reports.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium">Report Type</label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a report" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="usage">Usage Analytics</SelectItem>
                                <SelectItem value="treatment">Treatment History</SelectItem>
                                <SelectItem value="drone">Drone Maintenance Log</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div>
                        <label className="text-sm font-medium">Date Range</label>
                         <Popover>
                            <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                "w-full justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                            />
                            </PopoverContent>
                        </Popover>
                     </div>
                </div>
                 <Button className="w-full">
                    <FileDown className="mr-2 h-4 w-4" /> Generate Report (PDF)
                </Button>
            </CardContent>
        </Card>
    );
}
