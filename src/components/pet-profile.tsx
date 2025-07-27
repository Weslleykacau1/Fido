
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
import { cn } from '@/lib/utils';


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

  const [showAddForm, setShowAddForm] = useState(false);
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
    setShowAddForm(false);
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
    <Card className="w-full bg-card/80 backdrop-blur-lg shadow-2xl shadow-primary/10 rounded-2xl border-primary/20">
      <CardHeader className="text-center">
        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
          <PawPrint className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="font-headline text-2xl md:text-3xl font-bold tracking-tight text-foreground">Perfis dos Pets</CardTitle>
        <CardDescription className="font-body text-base md:text-lg pt-1 text-muted-foreground">Selecione, adicione e gerencie seus amigos</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] w-full pr-4">
            <div className="space-y-6">

            <AnimatePresence>
            {showAddForm && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                    <Card className="bg-background/50 mb-6">
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
                                    <div className="flex gap-2">
                                        <Button type="submit" className="w-full font-headline font-bold">
                                            <PlusCircle className="mr-2 h-5 w-5"/>
                                            Salvar Pet
                                        </Button>
                                         <Button variant="outline" className="w-full" onClick={() => setShowAddForm(false)}>
                                            Cancelar
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
            </AnimatePresence>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {pets.map(pet => (
                <Card 
                  key={pet.id}
                  onClick={() => handlePetSelection(pet.id)}
                  className={cn(
                    "cursor-pointer group relative transition-all duration-300 ease-in-out hover:shadow-primary/20 hover:border-primary/50",
                    selectedPetId === pet.id ? "border-primary shadow-lg shadow-primary/30" : "border-border"
                  )}
                >
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2 aspect-square">
                    <PawPrint className={cn(
                      "h-8 w-8 transition-colors",
                      selectedPetId === pet.id ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                    )}/>
                    <p className="font-headline text-lg font-semibold truncate w-full">{pet.name}</p>
                  </CardContent>
                  <AlertDialog>
                      <AlertDialogTrigger asChild>
                           <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-7 w-7 opacity-50 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                              <Trash2 className="h-4 w-4 text-destructive"/>
                          </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir {pet.name}?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Essa ação não pode ser desfeita e irá apagar o perfil e histórico de peso de {pet.name}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deletePet(pet.id)}>Excluir</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                  </AlertDialog>
                </Card>
              ))}
               <Card
                    onClick={() => setShowAddForm(true)}
                    className="cursor-pointer group transition-all duration-300 ease-in-out hover:shadow-primary/20 hover:border-primary/50 border-dashed"
                >
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2 aspect-square">
                        <PlusCircle className="h-8 w-8 text-muted-foreground transition-colors group-hover:text-primary" />
                        <p className="font-headline text-lg font-semibold text-muted-foreground group-hover:text-primary">Adicionar Pet</p>
                    </CardContent>
                </Card>
            </div>
            
            {pets.length > 0 && (
                <div className="pt-6">
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
            )}
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
