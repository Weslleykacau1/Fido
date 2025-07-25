"use client";

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, Bot, User } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const racasFAQ = [
  {
    raca: "Labrador Retriever",
    perguntasRespostas: [
      {
        pergunta: "Qual a melhor ração para Labrador?",
        resposta: "O Labrador precisa de ração rica em proteínas e controle de calorias, pois tende a engordar facilmente."
      },
      {
        pergunta: "Quantas gramas um Labrador deve comer por dia?",
        resposta: "Em média, um Labrador adulto come entre 300g a 450g por dia, dependendo do nível de atividade."
      }
    ]
  },
  {
    raca: "Shih Tzu",
    perguntasRespostas: [
      {
        pergunta: "O que o Shih Tzu pode comer?",
        resposta: "Shih Tzus devem comer ração específica para raças pequenas, com nutrientes que cuidem da pele e pelagem longa."
      },
      {
        pergunta: "Qual a quantidade de ração para Shih Tzu filhote?",
        resposta: "Shih Tzu filhotes comem cerca de 80g a 120g por dia, divididas em 3 a 4 refeições."
      }
    ]
  },
  {
    raca: "Golden Retriever",
    perguntasRespostas: [
      {
        pergunta: "Golden Retriever pode comer ração de filhote até que idade?",
        resposta: "Geralmente até 12 a 15 meses. Depois disso, troque gradualmente para ração de adulto."
      },
      {
        pergunta: "Quantas vezes um Golden deve comer por dia?",
        resposta: "2 vezes ao dia é o ideal, mantendo entre 350g a 500g diárias, conforme peso e atividade."
      }
    ]
  }
];

function responderChatbot(perguntaUsuario: string): string {
    const texto = perguntaUsuario.toLowerCase();

    // Tenta encontrar uma correspondência mais exata primeiro
    for (const raca of racasFAQ) {
        for (const qa of raca.perguntasRespostas) {
            // Verifica se a pergunta do usuário é muito similar à pergunta cadastrada
            if (qa.pergunta.toLowerCase() === texto) {
                return qa.resposta;
            }
        }
    }
    
    // Se não encontrar correspondência exata, tenta uma busca mais ampla
    for (const raca of racasFAQ) {
        if (texto.includes(raca.raca.toLowerCase())) {
            for (const qa of raca.perguntasRespostas) {
                const palavrasChave = qa.pergunta.toLowerCase().split(' ').slice(0, 3).join(' '); // Usa primeiras palavras como chave
                if (texto.includes(palavrasChave)) {
                    return qa.resposta;
                }
            }
        }
    }
    return "Desculpe, não encontrei uma resposta específica. Tente perguntar usando o nome da raça e palavras-chave como 'ração' ou 'quantidade'.";
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
                                <p>Pergunte sobre ração, quantidade, etc.</p>
                                <p className="text-xs mt-1">Ex: "Qual a melhor ração para Labrador?"</p>
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
