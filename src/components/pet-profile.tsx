
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
import { LineChart, User, Weight, History, Heart, Trash2, PlusCircle, PawPrint } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


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


export function PetProfile({ pets, setPets, selectedPetId, setSelectedPetId }: PetProfileProps) {

  const addPetForm = useForm<AddPetFormValues>({
    resolver: zodResolver(addPetFormSchema),
    defaultValues: { petName: "" },
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
  
  function deletePet(petId: string) {
    const updatedPets = pets.filter(p => p.id !== petId);
    setPets(updatedPets);
    if (selectedPetId === petId) {
      setSelectedPetId(updatedPets.length > 0 ? updatedPets[0].id : null);
    }
  }

  function deleteAllPets() {
    setPets([]);
    setSelectedPetId(null);
  }
  
  const handlePetSelection = (petId: string) => {
      setSelectedPetId(petId);
  }

  return (
    <Card className="w-full max-w-md bg-card/80 backdrop-blur-lg shadow-2xl shadow-primary/10 rounded-2xl border-primary/20">
      <CardHeader className="text-center">
        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
          <PawPrint className="h-8 w-8 text-primary" />
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
                      <div className="flex flex-col gap-4">
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
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" className="w-full font-headline font-bold">
                                <Trash2 className="mr-2 h-5 w-5"/>
                                Excluir Todos os Pets
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Essa ação não pode ser desfeita. Isso irá apagar permanentemente
                                  todos os perfis de pets salvos no seu navegador.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={deleteAllPets}>Excluir Tudo</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                    </CardContent>
                </Card>
            )}
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
