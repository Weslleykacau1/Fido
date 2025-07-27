
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Siren, Loader2, AlertTriangle, ExternalLink, Phone, MapPin } from 'lucide-react';
import { findVetsInCity } from '@/app/actions';

const searchSchema = z.object({
    city: z.string().min(3, "Por favor, insira um nome de cidade válido."),
});
type SearchFormValues = z.infer<typeof searchSchema>;

type Vet = {
    name: string;
    address: string;
    phone?: string;
}

export function Emergency() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [vets, setVets] = useState<Vet[]>([]);
    
    const form = useForm<SearchFormValues>({
        resolver: zodResolver(searchSchema),
        defaultValues: { city: "" },
    });


    async function onSubmit(values: SearchFormValues) {
        setIsLoading(true);
        setError(null);
        setVets([]);

        try {
            const response = await findVetsInCity({ city: values.city });
            
            if (response.success && response.data) {
                if (response.data.vets.length > 0) {
                    setVets(response.data.vets);
                } else {
                     setError(`Nenhuma clínica veterinária encontrada em "${values.city}". Tente uma cidade próxima ou verifique a grafia.`);
                }
            } else {
                 setError(response.error || "Ocorreu uma falha ao buscar. Tente novamente mais tarde.");
            }

        } catch (err) {
            setError("Ocorreu uma falha ao buscar. Verifique sua conexão ou tente novamente mais tarde.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full bg-card/80 backdrop-blur-lg shadow-2xl shadow-primary/10 rounded-2xl border-primary/20">
            <CardHeader className="text-center">
                <div className="mx-auto bg-destructive/10 p-4 rounded-full w-fit mb-4">
                    <Siren className="h-8 w-8 text-destructive" />
                </div>
                <CardTitle className="font-headline text-2xl md:text-3xl font-bold tracking-tight text-foreground">Emergência</CardTitle>
                <CardDescription className="font-body text-base md:text-lg pt-1 text-muted-foreground">Encontre veterinários 24h</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle className="font-headline">Atenção!</AlertTitle>
                    <AlertDescription className="font-body">
                        Em caso de emergência, ligue para um profissional imediatamente. Esta ferramenta é para auxílio.
                    </AlertDescription>
                </Alert>
                
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-headline text-md font-semibold">Informe sua cidade</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: São Paulo" {...field} className="font-body" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isLoading} className="w-full font-headline font-bold text-lg py-6 rounded-xl">
                            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <MapPin className="mr-2 h-5 w-5" />}
                            {isLoading ? "Buscando com IA..." : "Buscar Clínicas"}
                        </Button>
                    </form>
                </Form>


                {error && (
                     <Alert variant="default" className="bg-yellow-50 border-yellow-200">
                        <AlertTriangle className="h-4 w-4 text-yellow-700" />
                        <AlertTitle className="font-headline text-yellow-800">Aviso</AlertTitle>
                        <AlertDescription className="font-body text-yellow-700">
                           {error}
                        </AlertDescription>
                    </Alert>
                )}

                {vets.length > 0 && (
                    <div className="space-y-4">
                         <h3 className="font-headline text-lg font-semibold text-center">Clínicas encontradas:</h3>
                        {vets.map((vet, index) => (
                            <Card key={index} className="bg-background/50">
                                <CardHeader>
                                    <CardTitle className="font-headline text-lg flex justify-between items-center">
                                        {vet.name}
                                    </CardTitle>
                                    <CardDescription className="font-body">{vet.address}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-col sm:flex-row gap-2">
                                     {vet.phone && (
                                        <Button asChild variant="outline" className="w-full">
                                            <a href={`tel:${vet.phone}`}>
                                                <Phone className="mr-2 h-4 w-4" />
                                                Ligar: {vet.phone}
                                            </a>
                                        </Button>
                                    )}
                                    <Button asChild className="w-full">
                                        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(vet.name + ', ' + vet.address)}`} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="mr-2 h-4 w-4" />
                                            Ver no mapa
                                        </a>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
