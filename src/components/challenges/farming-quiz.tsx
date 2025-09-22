'use client';
import { useState, useEffect } from 'react';
import { getAiQuiz } from '@/app/actions';
import type { QuizQuestion } from '@/ai/flows/generate-farming-quiz.types';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AlertTriangle, BookOpen, Lightbulb, Sparkles, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export function FarmingQuiz() {
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const { toast } = useToast();

    useEffect(() => {
        const fetchQuiz = async () => {
            setIsLoading(true);
            setError(null);
            const result = await getAiQuiz();
            if (result.success && result.data) {
                setQuestions(result.data);
            } else {
                setError(result.error || "Could not load the daily quiz. Please try again later.");
            }
            setIsLoading(false);
        };
        fetchQuiz();
    }, []);

    const handleAnswerSubmit = () => {
        if (selectedAnswer === null) {
            toast({
                variant: 'destructive',
                title: 'No Answer Selected',
                description: 'Please select an option before submitting.',
            });
            return;
        }
        setIsAnswered(true);
        if (selectedAnswer === questions[currentQuestionIndex].correctAnswerIndex) {
            setScore(prev => prev + questions[currentQuestionIndex].points);
            toast({
                title: 'Correct!',
                description: `You earned ${questions[currentQuestionIndex].points} points.`,
                className: 'bg-green-100 dark:bg-green-900',
            });
        } else {
             toast({
                variant: 'destructive',
                title: 'Incorrect',
                description: 'Better luck next time!',
            });
        }
    };
    
    const handleNextQuestion = () => {
        setIsAnswered(false);
        setSelectedAnswer(null);
        setCurrentQuestionIndex(prev => prev + 1);
    }
    
    const handleReset = () => {
        setCurrentQuestionIndex(0);
        setScore(0);
        setIsAnswered(false);
        setSelectedAnswer(null);
    }

    if (isLoading) {
        return <div className="space-y-4">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>;
    }

    if (error) {
        return <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4"/>
            <AlertTitle>Error Loading Quiz</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>;
    }
    
    const isQuizFinished = currentQuestionIndex >= questions.length;
    
    if (isQuizFinished) {
        return (
             <Card className="text-center">
                 <CardHeader>
                    <CardTitle>Quiz Complete!</CardTitle>
                    <CardDescription>You've completed the daily farming quiz.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-lg">Your final score is:</p>
                    <p className="text-6xl font-bold text-primary my-4">{score}</p>
                    <p className="text-muted-foreground">Come back tomorrow for a new quiz!</p>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleReset} className="w-full">Try Again</Button>
                </CardFooter>
            </Card>
        );
    }
    
    const currentQuestion = questions[currentQuestionIndex];

    return (
         <Card>
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <BookOpen/> Daily Farming Quiz
                    </div>
                    <span className="text-sm font-normal text-muted-foreground">
                        Question {currentQuestionIndex + 1} of {questions.length}
                    </span>
                </CardTitle>
                 <CardDescription className="flex items-center gap-2 pt-2">
                    <Sparkles className="h-4 w-4 text-accent" />
                    <span>Test your knowledge and earn points!</span>
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold">{currentQuestion.question}</h3>
                </div>

                <RadioGroup 
                    value={selectedAnswer !== null ? String(selectedAnswer) : ""} 
                    onValueChange={(value) => setSelectedAnswer(Number(value))}
                    disabled={isAnswered}
                >
                    {currentQuestion.options.map((option, index) => {
                        const isCorrect = index === currentQuestion.correctAnswerIndex;
                        const isSelected = index === selectedAnswer;
                        return (
                            <Label 
                                key={index}
                                htmlFor={`option-${index}`}
                                className={cn(
                                    "flex items-center gap-3 p-3 border rounded-lg transition-all cursor-pointer",
                                    isAnswered && isCorrect && "bg-green-100 border-green-300 dark:bg-green-900/50 dark:border-green-700",
                                    isAnswered && isSelected && !isCorrect && "bg-red-100 border-red-300 dark:bg-red-900/50 dark:border-red-700",
                                    !isAnswered && "hover:bg-card-foreground/5",
                                )}
                            >
                                <RadioGroupItem value={String(index)} id={`option-${index}`}/>
                                <span>{option}</span>
                                {isAnswered && isCorrect && <CheckCircle className="ml-auto h-5 w-5 text-green-600"/>}
                                {isAnswered && isSelected && !isCorrect && <XCircle className="ml-auto h-5 w-5 text-red-600"/>}
                            </Label>
                        )
                    })}
                </RadioGroup>
                
                {isAnswered && (
                     <Alert className="bg-primary/5 border-primary/20">
                        <Lightbulb className="h-4 w-4"/>
                        <AlertTitle>Explanation</AlertTitle>
                        <AlertDescription>
                            {currentQuestion.explanation}
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
            <CardFooter>
                 {isAnswered ? (
                    <Button onClick={handleNextQuestion} className="w-full">
                        {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                    </Button>
                ) : (
                    <Button onClick={handleAnswerSubmit} className="w-full">Submit Answer</Button>
                )}
            </CardFooter>
        </Card>
    );
}
