"use client";

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, Bot, User, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { getChatResponse } from '@/app/actions';

type Message = {
    text: string;
    sender: 'user' | 'bot';
}

const suggestedQuestions = [
    "Qual a dieta do Labrador?",
    "Meu cachorro não quer comer.",
    "Quantas vezes devo alimentar meu cão?",
];

export function Chatbot() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const handleSend = async (question?: string) => {
        const textToSend = question || input;
        if (textToSend.trim() === '' || isLoading) return;

        const userMessage: Message = { text: textToSend, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        if(!question) {
            setInput('');
        }
        
        const historyForApi = messages.reduce((acc, msg, i) => {
            if (i % 2 === 0 && messages[i+1]) {
                acc.push({ user: messages[i].text, bot: messages[i+1].text });
            }
            return acc;
        }, [] as { user: string; bot: string }[]);

        const response = await getChatResponse({
            question: textToSend,
            history: historyForApi
        });

        let botMessage: Message;
        if (response.success && response.data) {
            botMessage = { text: response.data.answer, sender: 'bot' };
        } else {
            botMessage = { text: response.error || "Desculpe, algo deu errado.", sender: 'bot' };
        }

        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
    };
    
    useEffect(() => {
        if (scrollAreaRef.current) {
            const viewport = scrollAreaRef.current.querySelector('div');
            if(viewport){
                viewport.scrollTo({
                    top: viewport.scrollHeight,
                    behavior: 'smooth'
                });
            }
        }
    }, [messages]);

    const handleSuggestionClick = (question: string) => {
        setInput(question);
        handleSend(question);
    };

    return (
        <Card className="w-full max-w-md bg-card/80 backdrop-blur-lg shadow-2xl shadow-primary/10 rounded-2xl border-primary/20">
            <CardHeader className="text-center">
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                    <MessageSquare className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-headline text-3xl font-bold tracking-tight text-foreground">Converse com a IA</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col h-96">
                    <ScrollArea className="flex-grow p-4 border rounded-lg bg-background/50" ref={scrollAreaRef}>
                        <AnimatePresence>
                            {messages.map((msg, index) => (
                                <motion.div
                                    key={index}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={`flex items-start gap-3 my-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {msg.sender === 'bot' && <Bot className="h-6 w-6 text-primary flex-shrink-0" />}
                                    <div className={`rounded-lg px-4 py-2 max-w-xs ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                        <p className="text-sm font-body whitespace-pre-wrap">{msg.text}</p>
                                    </div>
                                    {msg.sender === 'user' && <User className="h-6 w-6 text-muted-foreground flex-shrink-0" />}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="flex items-start gap-3 my-3 justify-start"
                            >
                                <Bot className="h-6 w-6 text-primary flex-shrink-0 animate-pulse" />
                                <div className="rounded-lg px-4 py-2 max-w-xs bg-muted flex items-center">
                                    <Loader2 className="h-5 w-5 text-muted-foreground animate-spin"/>
                                </div>
                            </motion.div>
                        )}
                         {messages.length === 0 && !isLoading && (
                            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground font-body">
                                <MessageSquare className="h-12 w-12 mb-4" />
                                <p className="font-semibold">Tire suas dúvidas sobre alimentação canina.</p>
                                <p className="text-sm mt-2 mb-4">Ou tente uma das sugestões abaixo:</p>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {suggestedQuestions.map((q) => (
                                        <Button
                                            key={q}
                                            variant="outline"
                                            size="sm"
                                            className="font-body"
                                            onClick={() => handleSuggestionClick(q)}
                                        >
                                            {q}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </ScrollArea>
                    <div className="flex mt-4">
                        <Input
                            type="text"
                            placeholder="Escreva sua pergunta..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            className="flex-grow font-body"
                            disabled={isLoading}
                        />
                        <Button onClick={() => handleSend()} className="ml-2" disabled={isLoading}>
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
