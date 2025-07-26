
"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Pet } from '@/components/pet-profile';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, AlertTriangle } from 'lucide-react';
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


import { Dog, MessageSquare, Heart, Weight } from 'lucide-react';

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

    useEffect(() => {
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
            const daysLeft = 7 - daysPassed;
            
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

    const handlePurchase = () => {
        localStorage.setItem('hasPurchased', JSON.stringify(true));
        setHasPurchased(true);
        setShowTrialBanner(false);
    };

    const selectedPet = pets.find(p => p.id === selectedPetId) ?? null;

    return (
        <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/10 via-background to-background relative">
             <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>
            
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
                                        {trialDaysLeft > 0 ? `Você tem ${trialDaysLeft} dias de teste restantes.` : "Seu período de teste acabou."}
                                    </p>
                                    <p className="text-sm">Atualize para a versão Pro para acesso ilimitado.</p>
                                </div>
                            </div>
                            <Button asChild className="bg-green-600 hover:bg-green-700 text-white font-bold w-full sm:w-auto flex-shrink-0">
                                <Link href="https://pay.cakto.com.br/b9ajqrx_496563" target="_blank" rel="noopener noreferrer">
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Comprar Agora
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <DynamicTabs defaultValue="calculator" className="w-full max-w-md md:max-w-2xl mx-auto">
                <div className="flex justify-center">
                    <DynamicTabsList className="h-auto md:h-12 rounded-xl p-1 flex-wrap md:flex-nowrap">
                        <DynamicTabsTrigger value="calculator" className="text-base font-semibold rounded-lg flex items-center gap-2 px-4 py-2 md:py-1.5">
                            <Dog />
                            Calculadora
                        </DynamicTabsTrigger>
                        <DynamicTabsTrigger value="chatbot" className="text-base font-semibold rounded-lg flex items-center gap-2 px-4 py-2 md:py-1.5">
                            <MessageSquare />
                            Dúvidas
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
            </DynamicTabs>
        </main>
    );
}
