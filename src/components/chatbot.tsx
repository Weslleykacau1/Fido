"use client";

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, Bot, User } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const dogBreeds = {
  "Labrador Retriever": {
    group: "Sporting",
    size: "large",
    diet: "Ração de alta qualidade com 25-30% de proteína e 12-15% de gordura. 800-1200g/dia, dependendo do peso e atividade.",
    tips: "Controle a quantidade para evitar obesidade. Ômega-3 ajuda na pelagem."
  },
  "Pastor Alemão": {
    group: "Herding",
    size: "large",
    diet: "Ração premium com 22-28% de proteína e fibras para digestão. 600-1000g/dia para adultos ativos.",
    tips: "Cuidado com problemas articulares; glucosamina pode ser benéfica."
  },
  "Bulldog": {
    group: "Non-Sporting",
    size: "medium",
    diet: "Ração com baixo teor de gordura (10-12%) e alta digestibilidade. 400-600g/dia, ajustado ao peso.",
    tips: "Evite alimentos que causem alergias, como trigo ou soja."
  },
  "Poodle": {
    group: "Non-Sporting",
    size: "variable",
    diet: "Ração com 25% de proteína e 15% de gordura. 200-500g/dia, dependendo do tamanho (toy, miniatura, padrão).",
    tips: "Suplementos para pele e pelagem são recomendados."
  },
  "Golden Retriever": {
    group: "Sporting",
    size: "large",
    diet: "Ração balanceada com 20-25% de proteína e 12-15% de gordura. 700-1100g/dia para adultos.",
    tips: "Ideal para atividades como natação; evite superalimentação."
  },
  "Beagle": {
    group: "Hound",
    size: "small",
    diet: "Ração com 20-25% de proteína e calorias moderadas. 300-500g/dia, ajustado ao peso.",
    tips: "Propenso a obesidade; controle porções e ofereça exercícios."
  },
  "Chihuahua": {
    group: "Toy",
    size: "small",
    diet: "Ração para raças pequenas com 25-30% de proteína. 100-200g/dia, dependendo do peso.",
    tips: "Evite alimentos gordurosos devido ao metabolismo rápido."
  },
  "Rottweiler": {
    group: "Working",
    size: "large",
    diet: "Ração com 24-28% de proteína e suporte articular. 800-1200g/dia para adultos ativos.",
    tips: "Treinamento e socialização são cruciais; evite obesidade."
  },
  "Border Collie": {
    group: "Herding",
    size: "medium",
    diet: "Ração com 25-30% de proteína para alta energia. 500-800g/dia, dependendo da atividade.",
    tips: "Necessita de estímulo mental e físico; dieta energética."
  },
  "Caramelo": {
    group: "Non-Sporting",
    size: "medium",
    diet: "Ração balanceada com 20-25% de proteína. 400-700g/dia, ajustado ao peso.",
    tips: "Resiliente, mas monitore a digestão com mudanças na dieta."
  },
};

const sizeCategories = {
  "small": {
    diet: "Ração para raças pequenas com 25-30% de proteína e calorias moderadas. 100-400g/dia, dependendo do peso.",
    tips: "Evite superalimentação; raças pequenas têm metabolismo rápido."
  },
  "medium": {
    diet: "Ração balanceada com 20-25% de proteína e 10-15% de gordura. 400-800g/dia, dependendo do peso e atividade.",
    tips: "Monitore o peso para evitar obesidade; exercícios moderados são ideais."
  },
  "large": {
    diet: "Ração com 22-28% de proteína e suporte articular. 600-1200g/dia, dependendo do peso e atividade.",
    tips: "Suplementos como glucosamina ajudam em raças grandes."
  }
};

const faqs = {
  "melhor_racao": {
    keywords: ["melhor ração", "qual ração", "ração ideal"],
    answer: "A melhor ração depende da raça, idade, peso e nível de atividade do seu cão. Raças grandes como Labrador precisam de rações com mais proteína (25-30%), enquanto raças pequenas como Chihuahua se beneficiam de rações com menos calorias. Sempre escolha rações premium e consulte um veterinário."
  },
  "frequencia_alimentacao": {
    keywords: ["quantas vezes", "vezes por dia", "alimentar meu cão"],
    answer: "Filhotes (até 6 meses) comem 3-4 vezes ao dia. Cães adultos comem 1-2 vezes ao dia, dependendo da raça e rotina. Divida a quantidade diária recomendada para evitar problemas digestivos."
  },
  "comida_caseira": {
    keywords: ["comida caseira", "pode comer comida", "alimento caseiro"],
    answer: "Comida caseira pode ser uma opção, mas deve ser balanceada com proteínas, carboidratos e vegetais, evitando temperos, sal e alimentos tóxicos (como cebola, alho, chocolate). Consulte um veterinário para montar uma dieta adequada."
  },
  "alimentos_toxicos": {
    keywords: ["tóxicos", "alimentos perigosos", "não pode comer"],
    answer: "Alimentos tóxicos incluem chocolate, uvas, passas, cebola, alho, abacate, nozes de macadâmia e xilitol (adoçante). Evite ossos cozidos, que podem lascar e causar obstruções."
  },
  "sobrepeso": {
    keywords: ["sobrepeso", "cão gordo", "peso do cão"],
    answer: "Verifique se consegue sentir as costelas do cão com leve pressão. Se ele tem cintura pouco definida ou barriga proeminente, pode estar com sobrepeso. Consulte um veterinário para ajustar a dieta."
  },
  "nao_come": {
    keywords: ["não come", "recusa ração", "sem apetite", "não quer comer"],
    answer: "A recusa em comer pode ter várias causas. Primeiro, verifique se houve alguma mudança na rotina ou estresse. Você pode tentar misturar um pouco de ração úmida ou um caldo de galinha (sem tempero) para tornar o alimento mais atrativo.\n\nNo entanto, a falta de apetite pode ser um sinal de problemas de saúde. Se a recusa persistir por mais de 24 horas, ou se vier acompanhada de outros sintomas como vômito, diarreia ou letargia, **procure um veterinário imediatamente**."
  },
  "ossos": {
    keywords: ["osso", "ossos"],
    answer: "Não é recomendado dar ossos para cachorros, especialmente cozidos, pois podem lascar e causar perfurações, engasgos e problemas dentários. Ossos crus também oferecem risco de contaminação por bactérias como Salmonella.\n\n**Riscos Graves:**\n- Perfurações no esôfago, estômago ou intestino.\n- Asfixia e engasgos.\n- Fraturas nos dentes.\n\n**Alternativas Seguras:**\n- Brinquedos de nylon ou ossos recreativos feitos de materiais seguros, sempre sob supervisão.\n\n**Importante:** Consulte sempre um veterinário antes de oferecer qualquer tipo de osso. Se seu cão ingerir um e apresentar sintomas (vômito, diarreia), procure ajuda profissional imediatamente."
  }
};

function responderChatbot(perguntaUsuario: string): string {
  const input = perguntaUsuario.toLowerCase();

  // 1. Verificar por raças específicas
  for (const breedName in dogBreeds) {
    if (input.includes(breedName.toLowerCase())) {
      const breedData = dogBreeds[breedName as keyof typeof dogBreeds];
      return `Sobre ${breedName}: ${breedData.diet} Dica: ${breedData.tips}`;
    }
  }

  // 2. Verificar por perguntas frequentes (FAQs)
  for (const faqKey in faqs) {
    const faq = faqs[faqKey as keyof typeof faqs];
    if (faq.keywords.some(keyword => input.includes(keyword))) {
      return faq.answer;
    }
  }
  
  // 3. Verificar por porte (size)
  for (const sizeName in sizeCategories) {
      if (input.includes(sizeName)) {
          const sizeData = sizeCategories[sizeName as keyof typeof sizeCategories];
          return `Para cães de porte ${sizeName}: ${sizeData.diet} Dica: ${sizeData.tips}`;
      }
  }

  return "Desculpe, não sei responder isso ainda. Tente reformular ou fale com um veterinário.";
}

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
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const handleSend = (question?: string) => {
        const textToSend = question || input;
        if (textToSend.trim() === '') return;

        const userMessage: Message = { text: textToSend, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);

        const botResponse = responderChatbot(textToSend);
        const botMessage: Message = { text: botResponse, sender: 'bot' };

        setTimeout(() => {
            setMessages(prev => [...prev, botMessage]);
        }, 500);

        if(!question) {
            setInput('');
        }
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
                <CardTitle className="font-headline text-3xl font-bold tracking-tight text-foreground">Dúvidas Frequentes</CardTitle>
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
                         {messages.length === 0 && (
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
                        />
                        <Button onClick={() => handleSend()} className="ml-2">
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
