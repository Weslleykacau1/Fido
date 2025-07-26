
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Siren, MapPin, Loader2, AlertTriangle, ExternalLink, Phone } from 'lucide-react';

type Vet = {
    id: string;
    name: string;
    address: string;
    phone?: string;
    distance: number; 
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

        if (!process.env.NEXT_PUBLIC_MAPBOX_API_KEY) {
            setError("Chave de API da Mapbox não encontrada. Por favor, adicione a chave ao arquivo .env e reinicie o servidor.");
            setIsLoading(false);
            return;
        }

        if (!navigator.geolocation) {
            setError("Geolocalização não é suportada por este navegador.");
            setIsLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchVets(longitude, latitude);
            },
            (err) => {
                setError(`Erro ao obter localização: ${err.message}. Verifique as permissões de localização do seu navegador.`);
                setIsLoading(false);
            }
        );
    };

    const fetchVets = async (longitude: number, latitude: number) => {
        const apiKey = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;
        const query = 'veterinário,clínica veterinária';
        const radiusInMeters = 10000; // 10km
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?proximity=${longitude},${latitude}&limit=10&radius=${radiusInMeters}&access_token=${apiKey}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.features && data.features.length > 0) {
                const foundVets: Vet[] = data.features.map((feature: any) => ({
                    id: feature.id,
                    name: feature.text,
                    address: feature.place_name.split(',').slice(1).join(',').trim(),
                    phone: feature.properties?.tel,
                    // Mapbox distance is not directly provided in geocoding, so we generate a maps link instead.
                    // For a real app, distance calculation would be a good addition.
                    distance: 0, // Placeholder
                    url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(feature.place_name)}`
                }));
                setVets(foundVets);
            } else {
                setError("Nenhum veterinário encontrado no raio de 10km. Tente novamente mais tarde ou aumente a área de busca.");
            }
        } catch (err) {
            setError("Falha ao buscar veterinários. Verifique sua conexão com a internet.");
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
                        <AlertTitle className="font-headline text-yellow-800">Aviso</AlertTitle>
                        <AlertDescription className="font-body text-yellow-700">
                           {error}
                        </AlertDescription>
                    </Alert>
                )}

                {vets.length > 0 && (
                    <div className="space-y-4">
                         <h3 className="font-headline text-lg font-semibold text-center">Veterinários encontrados:</h3>
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
                                                <Phone className="mr-2" />
                                                {vet.phone}
                                            </a>
                                        </Button>
                                    )}
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
                )}
            </CardContent>
        </Card>
    );
}
