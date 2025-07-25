"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getFoodAmount } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PawPrint, Loader2, Info, Utensils, Bone, Hash } from 'lucide-react';
import { AnimatePresence, motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ScrollArea } from './ui/scroll-area';

const formSchema = z.object({
    breed: z.string({ required_error: 'Por favor, selecione uma raça.' }).min(1, { message: "Por favor, selecione uma raça." }),
    ageInMonths: z.coerce.number({ invalid_type_error: "Por favor, insira uma idade válida." }).positive({ message: "A idade deve ser um número positivo." }).max(240, { message: "A idade parece muito alta." }),
});

type FormValues = z.infer<typeof formSchema>;

type ResultState = {
    foodAmountInGrams: number;
} | null;

const dogBreeds = [
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


export function PetNutritionCalculator() {
    const [result, setResult] = useState<ResultState>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showFooter, setShowFooter] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            breed: "",
            ageInMonths: undefined,
        },
    });

    async function onSubmit(values: FormValues) {
        setIsLoading(true);
        setShowFooter(true);
        setResult(null);
        setError(null);

        const response = await getFoodAmount({
            breed: values.breed,
            ageInMonths: values.ageInMonths,
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

    return (
        <Card className="w-full max-w-md bg-card/60 backdrop-blur-sm shadow-2xl shadow-primary/10 rounded-2xl">
            <CardHeader className="text-center">
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4 border border-primary/20">
                    <Utensils className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-headline text-4xl">FidoFeed.ai</CardTitle>
                <CardDescription className="font-body text-lg pt-1">O nutricionista pessoal do seu cão</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="breed"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-headline text-md flex items-center gap-2"><Bone className="h-4 w-4" /> Raça do Cão</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Selecione uma raça" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <ScrollArea className="h-72">
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
                                    <FormLabel className="font-headline text-md flex items-center gap-2"><Hash className="h-4 w-4" /> Idade em meses</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="ex: 5" {...field} value={field.value ?? ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isLoading} className="w-full font-headline text-lg py-6 rounded-xl">
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

                        {result && (
                            <div className="space-y-4">
                                <div className="w-full text-center p-6 bg-primary/5 rounded-xl border border-primary/20">
                                    <p className="font-body text-muted-foreground">Ingestão diária recomendada:</p>
                                    <p className="font-headline text-6xl font-bold text-primary my-2">
                                        {Math.round(result.foodAmountInGrams)}<span className="text-3xl font-body text-muted-foreground/80">g</span>
                                    </p>
                                    <p className="font-body text-sm text-muted-foreground">por dia, dividido em 2-3 refeições.</p>
                                </div>
                                <Alert>
                                    <Info className="h-4 w-4" />
                                    <AlertTitle className="font-headline">Conselho Amigável</AlertTitle>
                                    <AlertDescription className="font-body">
                                        Esta é uma estimativa baseada nas necessidades médias. Por favor, consulte o seu veterinário para confirmar a melhor dieta para o seu animal de estimação.
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
