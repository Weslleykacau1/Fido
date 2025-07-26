
"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getFoodAmount } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PawPrint, Loader2, Info, Utensils, Bone, Hash, Dog, ChevronsRight, Heart, Weight, Share2 } from 'lucide-react';
import { AnimatePresence, motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from './ui/scroll-area';
import { Pet } from './pet-profile';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
    dogId: z.string().optional(),
    breed: z.string({ required_error: 'Por favor, selecione uma raça.' }).min(1, { message: "Por favor, selecione uma raça." }),
    ageInMonths: z.coerce.number({ invalid_type_error: "Por favor, insira uma idade válida." }).positive({ message: "A idade deve ser um número positivo." }).max(240, { message: "A idade parece muito alta." }),
    calculationMode: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type ResultState = {
    foodAmountInGrams: number;
} | null;

const dogBreeds = [
    { value: "caramelo", label: "Caramelo (Vira-lata)" },
    { value: "labrador", label: "Labrador Retriever" },
    { value: "poodle", label: "Poodle" },
    { value: "shihtzu", label: "Shih Tzu" },
    { value: "pinscher", label: "Pinscher" },
    { value: "golden", label: "Golden Retriever" },
    { value: "bulldog", label: "Bulldog Inglês" },
    { value: "beagle", label: "Beagle" },
    { value: "yorkshire", label: "Yorkshire Terrier" },
    { value: "pastoralemao", label: "Pastor Alemão" },
    { value: "rottweiler", label: "Rottweiler" },
    { value: "boxer", label: "Boxer" },
    { value: "dachshund", label: "Dachshund" },
    { value: "siberianhusky", label: "Husky Siberiano" },
    { value: "doberman", label: "Doberman" },
    { value: "australianshepherd", label: "Pastor Australiano" },
    { value: "schnauzer", label: "Schnauzer" },
    { value: "chihuahua", label: "Chihuahua" },
    { value: "pug", label: "Pug" },
    { value: "pomeranian", label: "Spitz Alemão (Pomerânia)" },
    { value: "bordercollie", label: "Border Collie" },
    { value: "maltese", label: "Maltês" },
    { value: "cockerspaniel", label: "Cocker Spaniel" },
    { value: "frenchbulldog", label: "Buldogue Francês" },
    { value: "greatdane", label: "Dogue Alemão" },
    { value: "bernese", label: "Boiadeiro Bernês" },
    { value: "akita", label: "Akita" },
    { value: "bichonfrise", label: "Bichon Frisé" },
    { value: "weimaraner", label: "Weimaraner" },
    { value: "dalmatian", label: "Dálmata" },
    { value: "bassetthound", label: "Basset Hound" },
    { value: "shibainu", label: "Shiba Inu" },
    { value: "stbernard", label: "São Bernardo" },
    { value: "vizsla", label: "Vizsla" },
    { value: "rhodesianridgeback", label: "Rhodesian Ridgeback" },
    { value: "canecorso", label: "Cane Corso" },
    { value: "bullterrier", label: "Bull Terrier" },
    { value: "staffordshirebullterrier", label: "Staffordshire Bull Terrier" },
    { value: "newfoundland", label: "Terra Nova" },
    { value: "englishsetter", label: "Setter Inglês" },
    { value: "irishwolfhound", label: "Lébrel Irlandês" },
    { value: "papillon", label: "Papillon" },
    { value: "samoyed", label: "Samoieda" },
    { value: "whippet", label: "Whippet" },
    { value: "pekingese", label: "Pequinês" },
    { value: "bloodhound", label: "Bloodhound" },
    { value: "chowchow", label: "Chow Chow" },
    { value: "jackrussell", label: "Jack Russell Terrier" },
    { value: "sharpei", label: "Shar Pei" },
    { value: "westie", label: "West Highland White Terrier" },
    { value: "cavalierkingcharles", label: "Cavalier King Charles Spaniel" }
];

const getLifeStage = (ageInMonths: number) => {
    if (ageInMonths <= 12) {
        return { stage: "Filhote", tip: "Fase de crescimento intenso. A nutrição é crucial para o desenvolvimento de ossos e músculos fortes." };
    } else if (ageInMonths <= 84) { // 7 years
        return { stage: "Adulto", tip: "Fase de manutenção. A dieta deve equilibrar energia e peso, evitando a obesidade." };
    } else {
        return { stage: "Sênior", tip: "Necessidades especiais. A dieta pode precisar de menos calorias e mais fibras, com foco na saúde das articulações." };
    }
}

interface PetNutritionCalculatorProps {
  selectedPet: Pet | null;
  pets: Pet[];
  setSelectedPetId: (id: string | null) => void;
}

export function PetNutritionCalculator({ selectedPet, pets, setSelectedPetId }: PetNutritionCalculatorProps) {
    const [result, setResult] = useState<ResultState>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showFooter, setShowFooter] = useState(false);
    const [submittedData, setSubmittedData] = useState<FormValues & {dogName: string} | null>(null);
    const { toast } = useToast();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            dogId: "",
            breed: "",
            ageInMonths: undefined,
            calculationMode: "breed",
        },
    });

    useEffect(() => {
        if (selectedPet) {
            const hasWeightHistory = selectedPet.weightHistory && selectedPet.weightHistory.length > 0;
            form.reset({
                dogId: selectedPet.id,
                breed: selectedPet.breed || "",
                ageInMonths: selectedPet.ageInMonths || undefined,
                calculationMode: hasWeightHistory ? "registered" : "breed",
            });
        } else {
             form.reset({
                dogId: "",
                breed: "",
                ageInMonths: undefined,
                calculationMode: "breed",
            })
        }
    }, [selectedPet, form]);

    async function onSubmit(values: FormValues) {
        setIsLoading(true);
        setShowFooter(true);
        setResult(null);
        setError(null);
        
        const currentPet = pets.find(p => p.id === values.dogId);
        const dogName = currentPet?.name ?? "Seu cão";
        setSubmittedData({...values, dogName});
        
        let weightInKg: number | undefined = undefined;
        if (values.calculationMode === 'registered' && currentPet?.weightHistory && currentPet.weightHistory.length > 0) {
            weightInKg = currentPet.weightHistory[0].weight;
        }

        const response = await getFoodAmount({
            breed: values.breed,
            ageInMonths: values.ageInMonths,
            weightInKg: weightInKg
        });

        if (response.success) {
            setResult(response.data);
        } else {
            setError(response.error);
        }

        setIsLoading(false);
    }
    
    const handleAnimationComplete = () => {
        if (!isLoading && !result && !error) {
            setShowFooter(false);
        }
    };
    
    const lifeStageInfo = submittedData ? getLifeStage(submittedData.ageInMonths) : null;
    const currentPet = pets.find(p => p.id === form.watch('dogId'));
    const hasWeightHistory = currentPet?.weightHistory && currentPet.weightHistory.length > 0;

    const handlePetSelection = (dogId: string) => {
      if (dogId === 'new') {
        setSelectedPetId(null);
      } else {
        setSelectedPetId(dogId);
      }
    }

    const handleShare = async () => {
        if (!result || !submittedData) return;
        
        const shareText = `🐶 FidoFeed.ai: A recomendação diária de ração para ${submittedData.dogName} é de ${Math.round(result.foodAmountInGrams)}g. Consulte sempre um veterinário!`;
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'FidoFeed.ai - Recomendação de Ração',
                    text: shareText,
                });
            } catch (error) {
                console.error('Erro ao compartilhar', error);
            }
        } else {
            try {
                await navigator.clipboard.writeText(shareText);
                toast({
                    title: "Copiado!",
                    description: "O resultado foi copiado para a área de transferência.",
                });
            } catch (err) {
                 toast({
                    title: "Oops!",
                    description: "Não foi possível copiar o resultado.",
                    variant: "destructive"
                });
            }
        }
    };


    return (
        <Card className="w-full bg-card/80 backdrop-blur-lg shadow-2xl shadow-primary/10 rounded-2xl border-primary/20">
            <CardHeader className="text-center">
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                    <Dog className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-foreground">FidoFeed.ai</CardTitle>
                <CardDescription className="font-body text-lg pt-1 text-muted-foreground">O nutricionista pessoal do seu cão</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="dogId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-headline text-md flex items-center gap-2 font-semibold"><Heart className="h-4 w-4" /> Selecionar Pet</FormLabel>
                                     <Select onValueChange={handlePetSelection} defaultValue={field.value} value={field.value ?? ""}>
                                        <FormControl>
                                        <SelectTrigger className="font-body">
                                            <SelectValue placeholder="Selecione um pet salvo..." />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                        <ScrollArea className="h-auto font-body">
                                            <SelectItem value="new">Calcular para um novo pet</SelectItem>
                                            {pets.map((pet) => (
                                            <SelectItem key={pet.id} value={pet.id}>
                                                {pet.name}
                                            </SelectItem>
                                            ))}
                                            {pets.length === 0 && <div className="text-sm text-muted-foreground text-center py-2 px-2">Nenhum pet salvo. Adicione um na aba Pets.</div>}
                                        </ScrollArea>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="breed"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-headline text-md flex items-center gap-2 font-semibold"><Bone className="h-4 w-4" /> Raça do Cão</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value ?? ""}>
                                    <FormControl>
                                      <SelectTrigger className="font-body">
                                        <SelectValue placeholder="Selecione uma raça" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <ScrollArea className="h-72 font-body">
                                        {dogBreeds.map((breed) => (
                                          <SelectItem key={breed.value} value={breed.value}>
                                            {breed.label}
                                          </SelectItem>
                                        ))}
                                      </ScrollArea>
                                    </SelectContent>
                                  </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="ageInMonths"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-headline text-md flex items-center gap-2 font-semibold"><Hash className="h-4 w-4" /> Idade em meses</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="ex: 5" {...field} value={field.value ?? ''} className="font-body" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        {hasWeightHistory && (
                            <FormField
                            control={form.control}
                            name="calculationMode"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                <FormLabel className="font-headline text-md flex items-center gap-2 font-semibold"><Weight className="h-4 w-4" /> Base do Cálculo</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-1"
                                    >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                        <RadioGroupItem value="breed" />
                                        </FormControl>
                                        <FormLabel className="font-normal font-body">
                                        Usar peso médio da raça
                                        </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                        <RadioGroupItem value="registered" />
                                        </FormControl>
                                        <FormLabel className="font-normal font-body">
                                            Usar último peso registrado ({currentPet?.weightHistory?.[0].weight} kg)
                                        </FormLabel>
                                    </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        )}


                        <Button type="submit" disabled={isLoading} className="w-full font-headline font-bold text-lg py-6 rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-shadow duration-300">
                            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <PawPrint className="mr-2 h-5 w-5" />}
                            Calcular
                        </Button>
                    </form>
                </Form>
            </CardContent>
            
            <AnimatePresence onExitComplete={handleAnimationComplete}>
            {showFooter && (
                <CardFooter>
                    <motion.div
                        className="w-full"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                        transition={{ duration: 0.5, ease: "circOut" }}
                    >
                        {isLoading && (
                            <div className="flex items-center justify-center p-8 text-muted-foreground font-body">
                                <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                                Calculando a porção perfeita...
                            </div>
                        )}

                        {error && (
                            <Alert variant="destructive">
                                <Info className="h-4 w-4" />
                                <AlertTitle className="font-headline">Oops!</AlertTitle>
                                <AlertDescription className="font-body">
                                    {error}
                                </AlertDescription>
                            </Alert>
                        )}

                        {result && submittedData && lifeStageInfo && (
                            <div className="space-y-4">
                                <div className="w-full text-center p-6 bg-primary/10 rounded-xl border border-primary/20 relative">
                                    <p className="font-body text-muted-foreground">Porção diária para {submittedData.dogName}:</p>
                                    <p className="font-headline text-5xl md:text-6xl font-bold text-primary my-2">
                                        {Math.round(result.foodAmountInGrams)}<span className="text-2xl md:text-3xl font-body text-muted-foreground/80">g</span>
                                    </p>
                                    <p className="font-body text-sm text-muted-foreground">dividido em 2-3 refeições.</p>
                                </div>

                                <Card className="bg-accent/20 border-accent/30">
                                     <CardHeader>
                                        <CardTitle className="font-headline text-lg flex items-center gap-2">
                                            <ChevronsRight className="h-5 w-5 text-primary"/>
                                            Fase de Vida: {lifeStageInfo.stage}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="font-body text-sm text-muted-foreground">{lifeStageInfo.tip}</p>
                                    </CardContent>
                                </Card>
                                
                                <Alert variant="default" className="bg-green-50 border-green-200">
                                    <Info className="h-4 w-4 text-green-700" />
                                    <AlertTitle className="font-headline text-green-800">Conselho Amigável</AlertTitle>
                                    <AlertDescription className="font-body text-green-700">
                                        Esta é uma estimativa. A necessidade real pode variar com o nível de atividade e metabolismo do seu cão. Consulte sempre um veterinário.
                                    </AlertDescription>
                                </Alert>
                            </div>
                        )}
                    </motion.div>
                </CardFooter>
            )}
            </AnimatePresence>
        </Card>
    );
}
