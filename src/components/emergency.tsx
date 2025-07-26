
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Siren, MapPin, Loader2, AlertTriangle, ExternalLink, Phone } from 'lucide-react';

// This is a placeholder for a real veterinarian object you would get from an API
type Vet = {
    name: string;
    address: string;
    phone: string;
    distance: number; // in km
    url: string;
}

export function Emergency() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [vets, setVets] = useState<Vet[]>([]);

    const handleSearch = () => {
        setIsLoading(true);
        setError(null);
        setVets([]);

        // In a real app, you would use the Geolocation API here.
        // navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
        
        // Simulating an API call with a delay and an error
        setTimeout(() => {
            setError("Para ativar esta função, é necessário adicionar uma chave de API do Google Maps Places ao código-fonte. A busca de veterinários em tempo real não está ativa no momento.");
            setIsLoading(false);

            // Placeholder data to show the UI structure
            setVets([
                { name: "Clínica Vet Exemplo 24h", address: "Rua das Flores, 123", phone: "(11) 99999-8888", distance: 2.5, url: "https://www.google.com/maps" },
                { name: "Hospital Veterinário de Exemplo", address: "Avenida dos Animais, 456", phone: "(11) 98888-7777", distance: 4.1, url: "https://www.google.com/maps" },
            ]);

        }, 1500);
    };

    return (
        <Card className="w-full bg-card/80 backdrop-blur-lg shadow-2xl shadow-primary/10 rounded-2xl border-primary/20">
            <CardHeader className="text-center">
                <div className="mx-auto bg-destructive/10 p-4 rounded-full w-fit mb-4">
                    <Siren className="h-8 w-8 text-destructive" />
                </div>
                <CardTitle className="font-headline text-2xl md:text-3xl font-bold tracking-tight text-foreground">Emergência 24h</CardTitle>
                <CardDescription className="font-body text-base md:text-lg pt-1 text-muted-foreground">Encontre veterinários próximos a você</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle className="font-headline">Atenção!</AlertTitle>
                    <AlertDescription className="font-body">
                        Em caso de emergência, ligue para um profissional imediatamente. Esta ferramenta é apenas para auxílio.
                    </AlertDescription>
                </Alert>
                
                <Button onClick={handleSearch} disabled={isLoading} className="w-full font-headline font-bold text-lg py-6 rounded-xl">
                    {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <MapPin className="mr-2 h-5 w-5" />}
                    {isLoading ? "Buscando..." : "Buscar Veterinários Próximos"}
                </Button>

                {error && (
                     <Alert variant="default" className="bg-yellow-50 border-yellow-200">
                        <AlertTriangle className="h-4 w-4 text-yellow-700" />
                        <AlertTitle className="font-headline text-yellow-800">Funcionalidade Incompleta</AlertTitle>
                        <AlertDescription className="font-body text-yellow-700">
                           {error}
                        </AlertDescription>
                    </Alert>
                )}

                <div className="space-y-4">
                    {vets.map((vet, index) => (
                        <Card key={index} className="bg-background/50">
                            <CardHeader>
                                <CardTitle className="font-headline text-lg flex justify-between items-center">
                                    {vet.name}
                                    <span className="text-sm font-body font-normal text-muted-foreground">{vet.distance.toFixed(1)} km</span>
                                </CardTitle>
                                <CardDescription className="font-body">{vet.address}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col sm:flex-row gap-2">
                                <Button asChild variant="outline" className="w-full">
                                    <a href={`tel:${vet.phone}`}>
                                        <Phone className="mr-2" />
                                        {vet.phone}
                                    </a>
                                </Button>
                                <Button asChild className="w-full">
                                    <a href={vet.url} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="mr-2" />
                                        Ver no mapa
                                    </a>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

    