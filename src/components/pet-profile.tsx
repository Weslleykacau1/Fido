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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, User, Weight, History, Heart, Trash2, PlusCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const petSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "O nome precisa ter ao menos 2 letras."),
  breed: z.string().optional(),
  ageInMonths: z.number().optional(),
  weightHistory: z.array(z.object({
    weight: z.number(),
    date: z.string(),
  })).optional(),
});
export type Pet = z.infer<typeof petSchema>;

interface PetProfileProps {
    pets: Pet[];
    setPets: React.Dispatch<React.SetStateAction<Pet[]>>;
    selectedPetId: string | null;
    setSelectedPetId: React.Dispatch<React.SetStateAction<string | null>>;
}

const addPetFormSchema = z.object({
    petName: z.string().min(2, "O nome precisa ter ao menos 2 letras."),
});
type AddPetFormValues = z.infer<typeof addPetFormSchema>;

const weightFormSchema = z.object({
  weight: z.coerce.number().positive("O peso deve ser um número positivo.").max(150, "O peso parece muito alto para um cão."),
});
type WeightFormValues = z.infer<typeof weightFormSchema>;

export function PetProfile({ pets, setPets, selectedPetId, setSelectedPetId }: PetProfileProps) {

  const addPetForm = useForm<AddPetFormValues>({
    resolver: zodResolver(addPetFormSchema),
    defaultValues: { petName: "" },
  });

  const weightForm = useForm<WeightFormValues>({
    resolver: zodResolver(weightFormSchema),
    defaultValues: { weight: undefined },
  });
  
  const selectedPet = pets.find(p => p.id === selectedPetId) ?? null;

  function onAddPetSubmit(values: AddPetFormValues) {
    const newPet: Pet = {
      id: new Date().toISOString(),
      name: values.petName,
      weightHistory: [],
    };
    const updatedPets = [...pets, newPet];
    setPets(updatedPets);
    setSelectedPetId(newPet.id);
    addPetForm.reset();
  }

  function onWeightSubmit(values: WeightFormValues) {
    if (!selectedPetId) return;
    const newEntry = {
      weight: values.weight,
      date: new Date().toLocaleDateString('pt-BR'),
    };
    setPets(prev => prev.map(p =>
      p.id === selectedPetId ? { ...p, weightHistory: [newEntry, ...(p.weightHistory ?? [])] } : p
    ));
    weightForm.reset();
  }
  
  function deletePet(petId: string) {
    const updatedPets = pets.filter(p => p.id !== petId);
    setPets(updatedPets);
    if (selectedPetId === petId) {
      setSelectedPetId(updatedPets.length > 0 ? updatedPets[0].id : null);
    }
  }
  
  const handlePetSelection = (petId: string) => {
      setSelectedPetId(petId);
  }

  return (
    <Card className="w-full max-w-md bg-card/80 backdrop-blur-lg shadow-2xl shadow-primary/10 rounded-2xl border-primary/20">
      <CardHeader className="text-center">
        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
          <User className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="font-headline text-3xl font-bold tracking-tight text-foreground">Perfis dos Pets</CardTitle>
        <CardDescription className="font-body text-lg pt-1 text-muted-foreground">Acompanhe os dados dos seus amigos</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] w-full pr-4">
            <div className="space-y-6">

            <Card className="bg-background/50">
                <CardHeader>
                    <CardTitle className="font-headline text-xl flex items-center gap-2"><Heart className="h-5 w-5" /> Adicionar Novo Pet</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...addPetForm}>
                        <form onSubmit={addPetForm.handleSubmit(onAddPetSubmit)} className="space-y-4">
                            <FormField
                                control={addPetForm.control}
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
                                <PlusCircle className="mr-2 h-5 w-5"/>
                                Adicionar à Lista de Pets
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
            
            {pets.length > 0 && (
                <Card className="bg-background/50">
                    <CardHeader>
                        <CardTitle className="font-headline text-xl flex items-center gap-2"><User className="h-5 w-5" /> Selecione o Pet</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Select onValueChange={handlePetSelection} value={selectedPetId ?? undefined}>
                            <SelectTrigger className="w-full font-body">
                                <SelectValue placeholder="Selecione um pet..." />
                            </SelectTrigger>
                            <SelectContent>
                                <ScrollArea className="h-auto">
                                {pets.map((pet) => (
                                  <SelectItem key={pet.id} value={pet.id}>
                                    <div className="flex items-center justify-between w-full">
                                      <span>{pet.name}</span>
                                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => {e.stopPropagation(); deletePet(pet.id)}}>
                                        <Trash2 className="h-4 w-4 text-destructive"/>
                                      </Button>
                                    </div>
                                  </SelectItem>
                                ))}
                                </ScrollArea>
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>
            )}

            {selectedPet && (
             <AnimatePresence>
                <motion.div
                    key={selectedPetId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                >
                    <Card className="bg-background/50">
                        <CardHeader>
                        <CardTitle className="font-headline text-xl flex items-center gap-2"><Weight className="h-5 w-5" /> Atualizar Peso de {selectedPet.name}</CardTitle>
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
                        <CardTitle className="font-headline text-xl flex items-center gap-2"><History className="h-5 w-5" /> Histórico de Peso de {selectedPet.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                        <ScrollArea className="h-40 w-full pr-4">
                            <AnimatePresence>
                            {(selectedPet.weightHistory ?? []).length > 0 ? (
                                <ul className="space-y-2">
                                {(selectedPet.weightHistory ?? []).map((entry, index) => (
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
                </motion.div>
             </AnimatePresence>
            )}
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
