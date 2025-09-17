
'use client';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pause, Scan, Globe, CircleDot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function QuickActionsToolbar() {
    const { toast } = useToast();

    const handleAction = (action: string) => {
        toast({
            title: "Action Triggered",
            description: `${action} command sent to active drone.`,
        });
    }

    return (
        <Card>
            <CardContent className="p-2">
                <div className="flex items-center justify-around">
                     <Button variant="ghost" className="flex-1 flex-col h-auto" onClick={() => handleAction('Pause Spray')}>
                        <Pause className="h-5 w-5 text-yellow-500"/>
                        <span className="text-xs mt-1">Pause</span>
                    </Button>
                    <Button variant="ghost" className="flex-1 flex-col h-auto" onClick={() => handleAction('Return to Hover')}>
                        <CircleDot className="h-5 w-5 text-blue-500"/>
                        <span className="text-xs mt-1">Hover</span>
                    </Button>
                     <Button variant="ghost" className="flex-1 flex-col h-auto" onClick={() => handleAction('Rescan Field')}>
                        <Scan className="h-5 w-5 text-green-500"/>
                        <span className="text-xs mt-1">Rescan</span>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
