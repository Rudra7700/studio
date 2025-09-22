
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockChallenges, mockBadges, mockLeaderboard, mockFarmers } from '@/lib/mock-data';
import { ChallengeCard } from '@/components/challenges/challenge-card';
import { Trophy, Award, Shield, Gem, Sparkles, Loader2, BookOpen } from 'lucide-react';
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
import { useState, useEffect } from 'react';
import { getAiChallenges } from '@/app/actions';
import type { Challenge } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { FarmingQuiz } from '@/components/challenges/farming-quiz';

const iconMap: { [key: string]: React.ElementType } = {
  Sprout: Shield,
  Bug: Award,
  Droplets: Gem,
  Recycle: Shield,
  Eye: Award,
  Users: Gem,
};

export default function ChallengesPage() {
    const [dailyTasks, setDailyTasks] = useState<Challenge[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const weeklyQuests = mockChallenges.filter(c => c.type === 'weekly');

    useEffect(() => {
        const fetchChallenges = async () => {
            setIsLoading(true);
            setError(null);
            const existingTitles = [...mockChallenges, ...dailyTasks].map(c => c.title);
            const result = await getAiChallenges({ existingChallenges: existingTitles });
            if (result.success && result.data) {
                // Ensure AI-generated challenges have isCompleted set to false initially
                const newChallenges = result.data.map(c => ({...c, isCompleted: false}));
                setDailyTasks(newChallenges);
            } else {
                setError(result.error || "Could not load new daily challenges. Please try again.");
                // Fallback to mock data on error
                setDailyTasks(mockChallenges.filter(c => c.type === 'daily'));
            }
            setIsLoading(false);
        };

        fetchChallenges();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                            <CardTitle className="flex justify-between items-center">
                                Tasks & Quests
                                <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 rounded-lg bg-card border">
                                    <Sparkles className="h-4 w-4 text-accent" />
                                    <span>AI-Generated Daily Tasks</span>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                             <Tabs defaultValue="daily">
                                <TabsList>
                                    <TabsTrigger value="daily">Daily Tasks</TabsTrigger>
                                    <TabsTrigger value="quiz">Daily Quiz</TabsTrigger>
                                    <TabsTrigger value="weekly">Weekly Quests</TabsTrigger>
                                </TabsList>
                                <TabsContent value="daily" className="mt-4 space-y-3">
                                    {error && (
                                        <Alert variant="destructive">
                                            <AlertTriangle className="h-4 w-4"/>
                                            <AlertTitle>Error Loading Challenges</AlertTitle>
                                            <AlertDescription>{error} Displaying sample tasks.</AlertDescription>
                                        </Alert>
                                    )}
                                    {isLoading ? (
                                        <div className="space-y-3">
                                            <Skeleton className="h-20 w-full" />
                                            <Skeleton className="h-20 w-full" />
                                            <Skeleton className="h-20 w-full" />
                                        </div>
                                    ) : (
                                        dailyTasks.map(task => (
                                            <ChallengeCard key={task.id} challenge={task} />
                                        ))
                                    )}
                                </TabsContent>
                                <TabsContent value="quiz" className="mt-4">
                                    <FarmingQuiz />
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
