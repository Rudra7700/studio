import { StatsCard } from "@/components/stats-card";
import { Analytics } from "@/components/admin/analytics";
import { UserManagement } from "@/components/admin/user-management";
import { FleetStatus } from "@/components/admin/fleet-status";
import { ReportGenerator } from "@/components/admin/report-generator";
import { Users, Tractor, TestTube2, AlertTriangle } from "lucide-react";

export default function AdminPage() {
  return (
    <>
       <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-headline">Admin Dashboard</h1>
          <p className="text-muted-foreground">System-wide overview and management.</p>
        </div>
      </div>

       <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <StatsCard 
            title="Total Farmers" 
            value="2" 
            icon={<Users className="h-4 w-4" />}
            description="+2 this month"
        />
        <StatsCard 
            title="Drone Fleet" 
            value="3" 
            icon={<Tractor className="h-4 w-4" />}
            description="1 needs maintenance"
        />
        <StatsCard 
            title="Total Treatments" 
            value="28" 
            icon={<TestTube2 className="h-4 w-4" />}
            description="Completed this month"
        />
        <StatsCard 
            title="System Alerts" 
            value="1" 
            icon={<AlertTriangle className="h-4 w-4" />}
            description="Drone-002 battery issue"
            className="bg-destructive/20 border-destructive"
        />
      </div>

       <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <div className="xl:col-span-2 grid auto-rows-max items-start gap-4 lg:gap-8">
          <Analytics />
          <UserManagement />
        </div>
        <div className="space-y-4 md:space-y-8">
            <FleetStatus/>
            <ReportGenerator />
        </div>
       </div>
    </>
  );
}
