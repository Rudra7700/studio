'use client';
import { useState, useRef, useEffect, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, User, Loader2, Languages } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAssistantResponse } from '@/app/actions';
import type { AssistantInput } from '@/ai/flows/assistant-schema';

type Message = {
    id: string;
    role: 'user' | 'assistant';
    text: string;
};

const initialMessages: Message[] = [
    { id: '1', role: 'assistant', text: "Hello! I'm your Agri-AI assistant. How can I help you today? You can ask in English or हिंदी." },
];

export function AiAssistant() {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [input, setInput] = useState('');
    const [isPending, startTransition] = useTransition();
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const [language, setLanguage] = useState<'English' | 'Hindi'>('English');

    const scrollToBottom = () => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
        }
    };
    
    useEffect(scrollToBottom, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isPending) return;

        const userMessage: Message = { id: Date.now().toString(), role: 'user', text: input };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');

        startTransition(async () => {
            const assistantLoadingMessage: Message = { id: 'loading', role: 'assistant', text: '...' };
            setMessages(prev => [...prev, assistantLoadingMessage]);

            const response = await getAssistantResponse({
                history: newMessages.filter(m => m.id !== 'loading').map(m => ({role: m.role as ('user' | 'assistant'), text: m.text})),
                language: language === 'Hindi' ? 'Hindi' : undefined,
            });
            
            let assistantResponse: Message;
            if (response.success && response.data) {
                assistantResponse = { id: Date.now().toString(), role: 'assistant', text: response.data.text };
            } else {
                 assistantResponse = { id: Date.now().toString(), role: 'assistant', text: "I'm having trouble connecting to my knowledge base. Please try again later." };
            }
            
            setMessages(prev => prev.filter(m => m.id !== 'loading'));
            setMessages(prev => [...prev, assistantResponse]);
        });
    };
    
    const toggleLanguage = () => {
        setLanguage(lang => lang === 'English' ? 'Hindi' : 'English');
        // A real implementation would trigger translation or use a different AI prompt.
        // For this demo, we just add a message.
        const langMessage : Message = {
            id: Date.now().toString(),
            role: 'assistant',
            text: language === 'English' ? "अब आप हिंदी में पूछ सकते हैं।" : "You can now ask in English."
        }
        setMessages(prev => [...prev, langMessage]);
    }

    return (
        <Card className="flex flex-col h-full max-h-[600px]">
            <CardHeader className='flex-row items-center justify-between'>
                <CardTitle className="flex items-center gap-2">
                    <Bot className="w-6 h-6 text-primary" />
                    AI Assistant
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={toggleLanguage}>
                    <Languages className="h-5 w-5"/>
                    <span className="sr-only">Toggle Language</span>
                </Button>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden">
                <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
                    <div className="space-y-4">
                        {messages.map((message) => (
                            <div key={message.id} className={cn('flex items-start gap-3', message.role === 'user' ? 'justify-end' : 'justify-start')}>
                                {message.role === 'assistant' && <div className="p-2 bg-primary rounded-full text-primary-foreground"><Bot className="w-5 h-5" /></div>}
                                <div className={cn(
                                    'p-3 rounded-lg max-w-[80%]',
                                    message.role === 'user'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-card-foreground/5',
                                     message.id === 'loading' && 'animate-pulse'
                                )}>
                                    <p className="text-sm break-words">{message.text}</p>
                                </div>
                                {message.role === 'user' && <div className="p-2 bg-muted rounded-full text-muted-foreground"><User className="w-5 h-5" /></div>}
                            </div>
                        ))}
                         {isPending && (
                             <div className='flex items-start gap-3 justify-start'>
                                 <div className="p-2 bg-primary rounded-full text-primary-foreground"><Bot className="w-5 h-5" /></div>
                                <div className='p-3 rounded-lg bg-card-foreground/5'>
                                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground"/>
                                </div>
                             </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter>
                <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
                    <Input
                        id="message"
                        placeholder={`Type in ${language}...`}
                        className="flex-1"
                        autoComplete="off"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isPending}
                    />
                    <Button type="submit" size="icon" disabled={!input.trim() || isPending}>
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send</span>
                    </Button>
                </form>
            </CardFooter>
        </Card>
    );
}
