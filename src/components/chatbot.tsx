"use client";

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, Bot, User } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const faqData = [
  {
    pergunta: "Quantas vezes por dia devo alimentar meu cachorro?",
    resposta: "Cães adultos geralmente comem 2 vezes ao dia. Filhotes podem precisar de 3 a 4 refeições."
  },
  {
    pergunta: "Como saber a quantidade de ração ideal para meu cachorro?",
    resposta: "A quantidade depende da raça, idade, peso e nível de atividade. Use uma calculadora como a FidoFeed.ai para estimar corretamente."
  },
  {
    pergunta: "Posso dar comida caseira para meu cachorro?",
    resposta: "Sim, desde que balanceada com orientação de um veterinário ou nutricionista canino. Evite temperos, sal e cebola."
  },
  {
    pergunta: "Filhotes podem comer ração de adulto?",
    resposta: "Não. Filhotes devem comer ração específica para filhotes até completarem cerca de 12 meses (dependendo da raça)."
  },
  {
    pergunta: "Quais alimentos são proibidos para cães?",
    resposta: "Evite chocolate, uvas, cebola, alho, abacate, café e ossos cozidos. São tóxicos para cães."
  },
  {
    pergunta: "Posso dar ossos para meu cachorro?",
    resposta: "Nunca dê ossos cozidos. Ossos crus de açougue, sob orientação, podem ser seguros para mastigação supervisionada."
  },
  {
    pergunta: "O que fazer se meu cachorro estiver com diarreia?",
    resposta: "Suspenda a alimentação por 12 horas, ofereça água. Se persistir, procure o veterinário imediatamente."
  }
];


function responderChatbot(perguntaUsuario: string): string {
    const pergunta = perguntaUsuario.toLowerCase();

    // Tenta encontrar uma correspondência mais exata primeiro
    for (const item of faqData) {
        if (item.pergunta.toLowerCase() === pergunta) {
            return item.resposta;
        }
    }

    // Lógica de busca por palavras-chave
    const encontrada = faqData.find(item => {
        const palavrasPergunta = item.pergunta.toLowerCase().split(" ").slice(0, 3); // Usa as primeiras 3 palavras
        return palavrasPergunta.some(palavra => pergunta.includes(palavra));
    });

    return encontrada
        ? encontrada.resposta
        : "Desculpe, não sei responder isso ainda. Tente reformular ou fale com um veterinário.";
}

type Message = {
    text: string;
    sender: 'user' | 'bot';
}

export function Chatbot() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const handleSend = () => {
        if (input.trim() === '') return;

        const userMessage: Message = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);

        const botResponse = responderChatbot(input);
        const botMessage: Message = { text: botResponse, sender: 'bot' };

        setTimeout(() => {
            setMessages(prev => [...prev, botMessage]);
        }, 500);

        setInput('');
    };
    
    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);

    return (
        <Card className="w-full max-w-md bg-card/80 backdrop-blur-lg shadow-2xl shadow-primary/10 rounded-2xl border-primary/20">
            <CardHeader className="text-center">
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                    <MessageSquare className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-headline text-3xl font-bold tracking-tight text-foreground">Dúvidas Frequentes</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col h-80">
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
                                        <p className="text-sm font-body">{msg.text}</p>
                                    </div>
                                    {msg.sender === 'user' && <User className="h-6 w-6 text-muted-foreground flex-shrink-0" />}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                         {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground font-body">
                                <MessageSquare className="h-12 w-12 mb-4" />
                                <p>Tire suas dúvidas sobre alimentação canina.</p>
                                <p className="text-xs mt-1">Ex: "Quantas vezes devo alimentar meu cão?"</p>
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
                        />
                        <Button onClick={handleSend} className="ml-2">
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
