
"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Pet } from '@/components/pet-profile';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, AlertTriangle } from 'lucide-react';

const DynamicTabs = dynamic(() => import('@/components/ui/tabs').then((mod) => {
    // Need to do this because Tabs, TabsContent, etc are all named exports
    return { default: (props: any) => <mod.Tabs {...props} /> };
}), {
    ssr: false,
    loading: () => <Skeleton className="h-[600px] w-full rounded-2xl" />
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
    const [lang, setLang] = useState("");

    const [showTrialBanner, setShowTrialBanner] = useState(false);
    const [trialDaysLeft, setTrialDaysLeft] = useState(7);
    const [hasPurchased, setHasPurchased] = useState(false);

    useEffect(() => {
        setLang(navigator.language);

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

            if (daysLeft > 0) {
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
        <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/10 via-background to-background">
            
            <AnimatePresence>
                {showTrialBanner && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full max-w-md mx-auto mb-4"
                    >
                        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="h-6 w-6" />
                                <div className="font-body">
                                    <p className="font-bold">
                                        {trialDaysLeft > 0 ? `Você tem ${trialDaysLeft} dias de teste restantes.` : "Seu período de teste acabou."}
                                    </p>
                                    <p className="text-sm">Atualize para a versão Pro para acesso ilimitado.</p>
                                </div>
                            </div>
                            <Button onClick={handlePurchase} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold w-full sm:w-auto">
                                <Sparkles className="mr-2 h-4 w-4" />
                                Comprar Agora
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <DynamicTabs defaultValue="calculator" className="w-full max-w-md mx-auto">
                <div className="flex justify-center">
                    <DynamicTabsList className="h-12 rounded-xl p-1">
                        <DynamicTabsTrigger value="calculator" className="text-base font-semibold rounded-lg flex items-center gap-2 px-4">
                            <Dog />
                            Calculadora
                        </DynamicTabsTrigger>
                        <DynamicTabsTrigger value="chatbot" className="text-base font-semibold rounded-lg flex items-center gap-2 px-4">
                            <MessageSquare />
                            Dúvidas
                        </DynamicTabsTrigger>
                        <DynamicTabsTrigger value="profile" className="text-base font-semibold rounded-lg flex items-center gap-2 px-4">
                            <Heart />
                            Pets
                        </DynamicTabsTrigger>
                         <DynamicTabsTrigger value="weight" className="text-base font-semibold rounded-lg flex items-center gap-2 px-4">
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
