
"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Pet } from '@/components/pet-profile';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, AlertTriangle, MessageSquare, Siren, Share2, Calculator } from 'lucide-react';
import Link from 'next/link';
import { LoadingScreen } from '@/components/loading-screen';
import { ThemeToggle } from '@/components/theme-toggle';


const DynamicTabs = dynamic(() => import('@/components/ui/tabs').then((mod) => {
    // Need to do this because Tabs, TabsContent, etc are all named exports
    return { default: (props: any) => <mod.Tabs {...props} /> };
}), {
    ssr: false,
    loading: () => <LoadingScreen />
});

const DynamicTabsContent = dynamic(() => import('@/components/ui/tabs').then(mod => mod.TabsContent), { ssr: false });
const DynamicTabsList = dynamic(() => import('@/components/ui/tabs').then(mod => mod.TabsList), { ssr: false });
const DynamicTabsTrigger = dynamic(() => import('@/components/ui/tabs').then(mod => mod.TabsTrigger), { ssr: false });
const PetNutritionCalculator = dynamic(() => import('@/components/pet-nutrition-calculator').then(mod => mod.PetNutritionCalculator), { ssr: false });
const Chatbot = dynamic(() => import('@/components/chatbot').then(mod => mod.Chatbot), { ssr: false });
const PetProfile = dynamic(() => import('@/components/pet-profile').then(mod => mod.PetProfile), { ssr: false });
const WeightTracker = dynamic(() => import('@/components/weight-tracker').then(mod => mod.WeightTracker), { ssr: false });
const Emergency = dynamic(() => import('@/components/emergency').then(mod => mod.Emergency), { ssr: false });


import { Heart, Weight } from 'lucide-react';

const safelyParseJSON = (jsonString: string | null, defaultValue: any) => {
    if (!jsonString) return defaultValue;
    try {
        return JSON.parse(jsonString) ?? defaultValue;
    } catch (error) {
        console.error("Failed to parse JSON:", error);
        return defaultValue;
    }
};

export default function Home() {
    const [pets, setPets] = useState<Pet[]>([]);
    const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

    const [showTrialBanner, setShowTrialBanner] = useState(false);
    const [trialDaysLeft, setTrialDaysLeft] = useState(7);
    const [hasPurchased, setHasPurchased] = useState(false);
    
    const [activeTab, setActiveTab] = useState("calculator");
    const [isShareSupported, setIsShareSupported] = useState(false);


    useEffect(() => {
        if (navigator.share) {
            setIsShareSupported(true);
        }

        // Check for purchase success in URL
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('purchase') === 'success') {
            localStorage.setItem('hasPurchased', JSON.stringify(true));
            // Remove query params from URL without reloading
            window.history.replaceState({}, document.title, window.location.pathname);
        }
        
        const savedPets = safelyParseJSON(localStorage.getItem('pets'), []);
        setPets(savedPets);
        if (savedPets.length > 0) {
            setSelectedPetId(savedPets[0].id);
        }

        const purchased = safelyParseJSON(localStorage.getItem('hasPurchased'), false);
        setHasPurchased(purchased);

        if (!purchased) {
            let trialStartDate = safelyParseJSON(localStorage.getItem('trialStartDate'), null);
            if (!trialStartDate) {
                trialStartDate = new Date().toISOString();
                localStorage.setItem('trialStartDate', JSON.stringify(trialStartDate));
            }

            const startDate = new Date(trialStartDate);
            const today = new Date();
            const daysPassed = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
            const daysLeft = 2 - daysPassed;
            
            setTrialDaysLeft(daysLeft);

            if (daysLeft >= 0) { // Show banner even on the last day
                setShowTrialBanner(true);
            }
        }
    }, []);

    useEffect(() => {
        if (pets.length > 0) {
            localStorage.setItem('pets', JSON.stringify(pets));
        } else {
            localStorage.removeItem('pets');
        }
    }, [pets]);

    const handleShare = async () => {
        const shareData = {
            title: 'FidoFeed.ai',
            text: 'Descubra a nutrição ideal para o seu cão com FidoFeed.ai! Calcule a ração, tire dúvidas e acompanhe a saúde do seu pet.',
            url: window.location.href
        };
        try {
            await navigator.share(shareData);
        } catch (error) {
            console.error('Erro ao compartilhar:', error);
            // Optionally, implement a fallback like copying to clipboard
        }
    };

    const selectedPet = pets.find(p => p.id === selectedPetId) ?? null;

    return (
        <div className="relative min-h-screen">
            <main className="flex w-full flex-col items-center bg-background p-4 pb-28 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/10 via-background to-background">
                
                <AnimatePresence>
                    {showTrialBanner && !hasPurchased && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full max-w-md md:max-w-2xl mx-auto mb-4"
                        >
                            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-3 text-center sm:text-left">
                                    <AlertTriangle className="h-6 w-6 shrink-0" />
                                    <div className="font-body">
                                        <p className="font-bold">
                                            {trialDaysLeft > 0 ? `Você tem ${trialDaysLeft} dias de teste grátis.` : "Seu período de teste acabou."}
                                        </p>
                                        <p className="text-sm">Atualize para a versão Pro para acesso ilimitado.</p>
                                    </div>
                                </div>
                                <Button asChild className="bg-green-600 hover:bg-green-700 text-white font-bold w-full sm:w-auto flex-shrink-0">
                                    <Link href="https://pay.kiwify.com.br/MxNJx7A" target="_blank" rel="noopener noreferrer">
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        Comprar Agora
                                    </Link>
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                
                <DynamicTabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-md md:max-w-2xl mx-auto">
                    <div className="flex justify-center items-center gap-4 mb-4">
                        <DynamicTabsList className="h-auto md:h-12 rounded-xl p-1 flex-wrap md:flex-nowrap">
                            <DynamicTabsTrigger value="calculator" className="text-base font-semibold rounded-lg flex items-center gap-2 px-4 py-2 md:py-1.5">
                                <Calculator />
                                Calc
                            </DynamicTabsTrigger>
                            <DynamicTabsTrigger value="profile" className="text-base font-semibold rounded-lg flex items-center gap-2 px-4 py-2 md:py-1.5">
                                <Heart />
                                Pets
                            </DynamicTabsTrigger>
                            <DynamicTabsTrigger value="weight" className="text-base font-semibold rounded-lg flex items-center gap-2 px-4 py-2 md:py-1.5">
                                <Weight />
                                Peso
                            </DynamicTabsTrigger>
                        </DynamicTabsList>
                    </div>
                    <DynamicTabsContent value="calculator" className="mt-6">
                        <PetNutritionCalculator 
                            selectedPet={selectedPet} 
                            pets={pets}
                            setPets={setPets}
                            setSelectedPetId={setSelectedPetId}
                        />
                    </DynamicTabsContent>
                    <DynamicTabsContent value="chatbot" className="mt-6">
                        <Chatbot />
                    </DynamicTabsContent>
                    <DynamicTabsContent value="profile" className="mt-6">
                        <PetProfile 
                            pets={pets} 
                            setPets={setPets} 
                            selectedPetId={selectedPetId} 
                            setSelectedPetId={setSelectedPetId}
                        />
                    </DynamicTabsContent>
                    <DynamicTabsContent value="weight" className="mt-6">
                        <WeightTracker
                            pets={pets}
                            setPets={setPets}
                            selectedPetId={selectedPetId}
                            setSelectedPetId={setSelectedPetId}
                        />
                    </DynamicTabsContent>
                    <DynamicTabsContent value="emergency" className="mt-6">
                        <Emergency />
                    </DynamicTabsContent>
                </DynamicTabs>
            </main>
             <footer className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border p-4 flex justify-center items-center gap-4 z-10">
                <Button 
                    onClick={() => setActiveTab("chatbot")}
                    className="font-headline text-lg rounded-full shadow-lg shadow-primary/30"
                    size="lg"
                >
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Dúvidas sobre seu Pet
                </Button>
                 {isShareSupported && (
                    <Button variant="outline" size="icon" onClick={handleShare} aria-label="Compartilhar aplicativo">
                        <Share2 className="h-[1.2rem] w-[1.2rem]" />
                    </Button>
                )}
                <ThemeToggle />
            </footer>
             <div className="fixed bottom-24 right-4 z-20">
                <Button
                    onClick={() => setActiveTab("emergency")}
                    size="icon"
                    className="rounded-full w-16 h-16 bg-red-600 hover:bg-red-700 text-white shadow-xl shadow-red-500/30"
                    aria-label="Emergência"
                >
                    <Siren className="h-8 w-8" />
                </Button>
            </div>
        </div>
    );
}
