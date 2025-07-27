
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

const searchSchema = z.object({
    city: z.string().min(3, "Por favor, insira um nome de cidade válido."),
});
type SearchFormValues = z.infer<typeof searchSchema>;

type Vet = {
    id: string;
    name: string;
    address: string;
    phone?: string;
    url: string;
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

        if (!process.env.NEXT_PUBLIC_MAPBOX_API_KEY) {
            setError("Chave de API da Mapbox não configurada.");
            setIsLoading(false);
            return;
        }

        try {
            // 1. Geocode the city name to get coordinates
            const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(values.city)}.json?types=place&limit=1&access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}`;
            const geocodeResponse = await fetch(geocodeUrl);
            const geocodeData = await geocodeResponse.json();

            if (!geocodeData.features || geocodeData.features.length === 0) {
                setError(`Não foi possível encontrar a cidade "${values.city}". Verifique o nome e tente novamente.`);
                setIsLoading(false);
                return;
            }

            const [longitude, latitude] = geocodeData.features[0].center;

            // 2. Search for vets near the coordinates
            const query = 'veterinário,clínica veterinária';
            const vetsUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?proximity=${longitude},${latitude}&limit=10&access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}`;
            const vetsResponse = await fetch(vetsUrl);
            const vetsData = await vetsResponse.json();

            if (vetsData.features && vetsData.features.length > 0) {
                const foundVets: Vet[] = vetsData.features.map((feature: any) => ({
                    id: feature.id,
                    name: feature.text,
                    address: feature.place_name.split(',').slice(1).join(',').trim(),
                    phone: feature.properties?.tel,
                    url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(feature.place_name)}`
                }));
                setVets(foundVets);
            } else {
                setError("Nenhum veterinário encontrado próximo a esta cidade. Tente uma cidade maior ou verifique a grafia.");
            }

        } catch (err) {
            setError("Falha ao buscar. Verifique sua conexão ou tente novamente mais tarde.");
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
                            {isLoading ? "Buscando..." : "Buscar Clínicas"}
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
                        {vets.map((vet) => (
                            <Card key={vet.id} className="bg-background/50">
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
                                        <a href={vet.url} target="_blank" rel="noopener noreferrer">
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
