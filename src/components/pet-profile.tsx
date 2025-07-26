"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LineChart, User, Weight, History, Mail, Heart } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const weightFormSchema = z.object({
  weight: z.coerce.number().positive("O peso deve ser um número positivo.").max(150, "O peso parece muito alto para um cão."),
});
type WeightFormValues = z.infer<typeof weightFormSchema>;

const ownerFormSchema = z.object({
  ownerName: z.string().min(2, "O nome precisa ter ao menos 2 letras."),
  ownerEmail: z.string().email("Por favor, insira um e-mail válido."),
});
type OwnerFormValues = z.infer<typeof ownerFormSchema>;

const petFormSchema = z.object({
  petName: z.string().min(2, "O nome precisa ter ao menos 2 letras."),
});
type PetFormValues = z.infer<typeof petFormSchema>;


type WeightEntry = {
  weight: number;
  date: string;
};

const safelyParseJSON = (jsonString: string | null, defaultValue: any) => {
    if (!jsonString) return defaultValue;
    try {
        return JSON.parse(jsonString) ?? defaultValue;
    } catch (error) {
        console.error("Failed to parse JSON:", error);
        return defaultValue;
    }
};

export function PetProfile() {
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([]);
  const [ownerInfo, setOwnerInfo] = useState<OwnerFormValues | null>(null);
  const [petInfo, setPetInfo] = useState<PetFormValues | null>(null);

  useEffect(() => {
    const savedPetInfo = safelyParseJSON(localStorage.getItem('petInfo'), null);
    if (savedPetInfo) setPetInfo(savedPetInfo);
    
    const savedOwnerInfo = safelyParseJSON(localStorage.getItem('ownerInfo'), null);
    if (savedOwnerInfo) setOwnerInfo(savedOwnerInfo);

    const savedWeightHistory = safelyParseJSON(localStorage.getItem('weightHistory'), []);
    if (savedWeightHistory) setWeightHistory(savedWeightHistory);
  }, []);

  useEffect(() => {
    if(petInfo) localStorage.setItem('petInfo', JSON.stringify(petInfo));
  }, [petInfo]);

  useEffect(() => {
    if(ownerInfo) localStorage.setItem('ownerInfo', JSON.stringify(ownerInfo));
  }, [ownerInfo]);

  useEffect(() => {
    if(weightHistory.length > 0) localStorage.setItem('weightHistory', JSON.stringify(weightHistory));
  }, [weightHistory]);

  const weightForm = useForm<WeightFormValues>({
    resolver: zodResolver(weightFormSchema),
    defaultValues: {
      weight: undefined,
    },
  });

  const ownerForm = useForm<OwnerFormValues>({
    resolver: zodResolver(ownerFormSchema),
    values: ownerInfo ?? { ownerName: "", ownerEmail: "" }
  });

  const petForm = useForm<PetFormValues>({
    resolver: zodResolver(petFormSchema),
    values: petInfo ?? { petName: "" }
  });


  function onWeightSubmit(values: WeightFormValues) {
    const newEntry: WeightEntry = {
      weight: values.weight,
      date: new Date().toLocaleDate('pt-BR'),
    };
    setWeightHistory(prev => [newEntry, ...prev]);
    weightForm.reset();
  }

  function onOwnerSubmit(values: OwnerFormValues) {
    setOwnerInfo(values);
  }
  
  function onPetSubmit(values: PetFormValues) {
    setPetInfo(values);
  }


  return (
    <Card className="w-full max-w-md bg-card/80 backdrop-blur-lg shadow-2xl shadow-primary/10 rounded-2xl border-primary/20">
      <CardHeader className="text-center">
        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
          <User className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="font-headline text-3xl font-bold tracking-tight text-foreground">Perfil do Pet</CardTitle>
        <CardDescription className="font-body text-lg pt-1 text-muted-foreground">Acompanhe os dados do seu amigo</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] w-full pr-4">
            <div className="space-y-6">

            <Card className="bg-background/50">
                <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2"><Heart className="h-5 w-5" /> Dados do Pet</CardTitle>
                </CardHeader>
                <CardContent>
                <Form {...petForm}>
                    <form onSubmit={petForm.handleSubmit(onPetSubmit)} className="space-y-4">
                    <FormField
                        control={petForm.control}
                        name="petName"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-headline text-md font-semibold">Nome do Pet</FormLabel>
                            <FormControl>
                            <Input placeholder="Bob" {...field} className="font-body" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full font-headline font-bold">
                        Salvar Nome do Pet
                    </Button>
                    </form>
                </Form>
                </CardContent>
            </Card>

            <Card className="bg-background/50">
                <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2"><User className="h-5 w-5" /> Dados do Dono</CardTitle>
                </CardHeader>
                <CardContent>
                <Form {...ownerForm}>
                    <form onSubmit={ownerForm.handleSubmit(onOwnerSubmit)} className="space-y-4">
                    <FormField
                        control={ownerForm.control}
                        name="ownerName"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-headline text-md font-semibold">Nome</FormLabel>
                            <FormControl>
                            <Input placeholder="Seu nome" {...field} className="font-body" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={ownerForm.control}
                        name="ownerEmail"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-headline text-md font-semibold flex items-center gap-2"><Mail className="h-4 w-4"/> E-mail</FormLabel>
                            <FormControl>
                            <Input type="email" placeholder="seu@email.com" {...field} className="font-body" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full font-headline font-bold">
                        Salvar Dados
                    </Button>
                    </form>
                </Form>
                </CardContent>
            </Card>

            <Card className="bg-background/50">
                <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2"><Weight className="h-5 w-5" /> Atualizar Peso</CardTitle>
                </CardHeader>
                <CardContent>
                <Form {...weightForm}>
                    <form onSubmit={weightForm.handleSubmit(onWeightSubmit)} className="space-y-4">
                    <FormField
                        control={weightForm.control}
                        name="weight"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-headline text-md font-semibold">Novo peso (kg)</FormLabel>
                            <FormControl>
                            <Input type="number" step="0.1" placeholder="ex: 15.5" {...field} value={field.value ?? ''} className="font-body" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full font-headline font-bold">
                        Adicionar Registro de Peso
                    </Button>
                    </form>
                </Form>
                </CardContent>
            </Card>

            <Card className="bg-background/50">
                <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2"><History className="h-5 w-5" /> Histórico de Peso</CardTitle>
                </CardHeader>
                <CardContent>
                <ScrollArea className="h-40 w-full pr-4">
                    <AnimatePresence>
                    {weightHistory.length > 0 ? (
                        <ul className="space-y-2">
                        {weightHistory.map((entry, index) => (
                            <motion.li
                            key={index}
                            layout
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.3 }}
                            className="flex justify-between items-center p-2 rounded-md bg-muted/50"
                            >
                            <span className="font-body font-semibold">{entry.weight} kg</span>
                            <span className="font-body text-sm text-muted-foreground">{entry.date}</span>
                            </motion.li>
                        ))}
                        </ul>
                    ) : (
                        <div className="text-center text-muted-foreground font-body py-8">
                        <LineChart className="mx-auto h-8 w-8 mb-2" />
                        Nenhum registro de peso ainda.
                        </div>
                    )}
                    </AnimatePresence>
                </ScrollArea>
                </CardContent>
            </Card>
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
