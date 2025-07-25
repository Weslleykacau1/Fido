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

const formSchema = z.object({
    breed: z.string({ required_error: 'Please select a breed.' }).min(1, { message: "Please select a breed." }),
    ageInMonths: z.coerce.number({ invalid_type_error: "Please enter a valid age." }).positive({ message: "Age must be a positive number." }).max(240, { message: "Age seems too high." }),
});

type FormValues = z.infer<typeof formSchema>;

type ResultState = {
    foodAmountInGrams: number;
} | null;

const dogBreeds = [
  { value: 'poodle', label: 'Poodle' },
  { value: 'labrador', label: 'Labrador' },
  { value: 'shihtzu', label: 'Shih Tzu' },
  { value: 'golden retriever', label: 'Golden Retriever' },
  { value: 'pinscher', label: 'Pinscher' },
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
    
    // This is a workaround for Framer Motion's AnimatePresence exit animation
    // We delay hiding the footer to allow the animation to complete
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
                <CardDescription className="font-body text-lg pt-1">Your dog's personal nutritionist</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="breed"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-headline text-md flex items-center gap-2"><Bone className="h-4 w-4" /> Dog's Breed</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a breed" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {dogBreeds.map((breed) => (
                                        <SelectItem key={breed.value} value={breed.value}>
                                          {breed.label}
                                        </SelectItem>
                                      ))}
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
                                    <FormLabel className="font-headline text-md flex items-center gap-2"><Hash className="h-4 w-4" /> Age in months</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="e.g., 5" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isLoading} className="w-full font-headline text-lg py-6 rounded-xl">
                            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <PawPrint className="mr-2 h-5 w-5" />}
                            Calculate
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
                                Calculating the perfect portion...
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
                                    <p className="font-body text-muted-foreground">Recommended daily intake:</p>
                                    <p className="font-headline text-6xl font-bold text-primary my-2">
                                        {Math.round(result.foodAmountInGrams)}<span className="text-3xl font-body text-muted-foreground/80">g</span>
                                    </p>
                                    <p className="font-body text-sm text-muted-foreground">per day, split into 2-3 meals.</p>
                                </div>
                                <Alert>
                                    <Info className="h-4 w-4" />
                                    <AlertTitle className="font-headline">Friendly Advice</AlertTitle>
                                    <AlertDescription className="font-body">
                                        This is an estimate based on average needs. Please consult your veterinarian to confirm the best diet for your pet.
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
