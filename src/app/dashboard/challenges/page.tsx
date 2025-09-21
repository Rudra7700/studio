
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockChallenges, mockBadges, mockLeaderboard, mockFarmers } from '@/lib/mock-data';
import { ChallengeCard } from '@/components/challenges/challenge-card';
import { Trophy, Award, Shield, Gem } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Image from 'next/image';

const iconMap: { [key: string]: React.ElementType } = {
  Sprout: Shield,
  Bug: Award,
  Droplets: Gem,
  Recycle: Shield,
  Eye: Award,
  Users: Gem,
};

export default function ChallengesPage() {
    const dailyTasks = mockChallenges.filter(c => c.type === 'daily');
    const weeklyQuests = mockChallenges.filter(c => c.type === 'weekly');

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
                        <Trophy className="w-7 h-7 text-yellow-500" />
                        Farming Challenges & Rewards
                    </h1>
                    <p className="text-muted-foreground">Complete tasks to earn points, unlock badges, and climb the leaderboard.</p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tasks & Quests</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <Tabs defaultValue="daily">
                                <TabsList>
                                    <TabsTrigger value="daily">Daily Tasks</TabsTrigger>
                                    <TabsTrigger value="weekly">Weekly Quests</TabsTrigger>
                                    <TabsTrigger value="seasonal" disabled>Seasonal Campaigns</TabsTrigger>
                                </TabsList>
                                <TabsContent value="daily" className="mt-4 space-y-3">
                                    {dailyTasks.map(task => (
                                        <ChallengeCard key={task.id} challenge={task} />
                                    ))}
                                </TabsContent>
                                <TabsContent value="weekly" className="mt-4 space-y-3">
                                     {weeklyQuests.map(quest => (
                                        <ChallengeCard key={quest.id} challenge={quest} />
                                    ))}
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Achievements</CardTitle>
                            <CardDescription>Unlock badges by completing milestones.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <TooltipProvider>
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                                    {mockBadges.map(badge => {
                                        const Icon = iconMap[badge.icon] || Shield;
                                        return (
                                            <Tooltip key={badge.id}>
                                                <TooltipTrigger asChild>
                                                    <div className={cn(
                                                        "flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all",
                                                        badge.isUnlocked 
                                                            ? "border-yellow-500 bg-yellow-500/10" 
                                                            : "border-dashed bg-card opacity-50"
                                                    )}>
                                                        <Icon className={cn("h-8 w-8", badge.isUnlocked ? "text-yellow-600" : "text-muted-foreground")} />
                                                        <p className="text-xs font-semibold text-center leading-tight">{badge.name}</p>
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p className="font-bold">{badge.name} {badge.isUnlocked && "✓"}</p>
                                                    <p className="text-sm text-muted-foreground">{badge.description}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        )
                                    })}
                                </div>
                            </TooltipProvider>
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-1">
                     <Card>
                        <CardHeader>
                            <CardTitle>Community Leaderboard</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                    <TableHead>Rank</TableHead>
                                    <TableHead>Farmer</TableHead>
                                    <TableHead className="text-right">Points</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockLeaderboard.map(entry => {
                                        const farmer = mockFarmers.find(f => f.id === entry.farmerId);
                                        const isCurrentUser = entry.farmerId === 'farmer-1';
                                        return (
                                             <TableRow key={entry.rank} className={cn(isCurrentUser && 'bg-primary/10')}>
                                                <TableCell className="font-bold">{entry.rank}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Image src={farmer?.avatarUrl || 'https://picsum.photos/seed/farmer-mock/40/40'} alt={farmer?.name || 'Mock Farmer'} width={32} height={32} className="rounded-full" />
                                                        <span className="font-medium truncate max-w-24">{farmer?.name || `Farmer #${entry.rank}`}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right font-bold text-primary">{entry.points.toLocaleString()}</TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
