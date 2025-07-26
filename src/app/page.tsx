"use client";

import { useState, useEffect } from 'react';
import { PetNutritionCalculator } from '@/components/pet-nutrition-calculator';
import { Chatbot } from '@/components/chatbot';
import { PetProfile, Pet } from '@/components/pet-profile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dog, MessageSquare, Heart, Sparkles, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';


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
  const [isClient, setIsClient] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  // State for the trial banner
  const [showTrialBanner, setShowTrialBanner] = useState(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState(7);
  const [hasPurchased, setHasPurchased] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  useEffect(() => {
    if (!isClient) return;

    // All localStorage logic is now safely in useEffect and guarded by isClient
    const savedPets = safelyParseJSON(localStorage.getItem('pets'), []);
    setPets(savedPets);
    if (savedPets.length > 0) {
      setSelectedPetId(savedPets[0].id);
    }
    
    // Trial logic
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

  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;
    // This effect should also be guarded by isClient
    if (pets.length > 0 || localStorage.getItem('pets')) {
      localStorage.setItem('pets', JSON.stringify(pets));
    }
  }, [pets, isClient]);

  const handlePurchase = () => {
    localStorage.setItem('hasPurchased', JSON.stringify(true));
    setHasPurchased(true);
    setShowTrialBanner(false);
  }

  const selectedPet = pets.find(p => p.id === selectedPetId) ?? null;

  if (!isClient) {
    return (
        <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/10 via-background to-background">
            <div className="w-full max-w-md mx-auto space-y-8">
                 <Skeleton className="h-12 w-3/4 mx-auto rounded-xl" />
                 <Skeleton className="h-[600px] w-full rounded-2xl" />
            </div>
        </main>
    );
  }

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
      
      <Tabs defaultValue="calculator" className="w-full max-w-md mx-auto">
        <div className="flex justify-center">
          <TabsList className="h-12 rounded-xl p-1">
            <TabsTrigger value="calculator" className="text-base font-semibold rounded-lg flex items-center gap-2 px-4">
              <Dog />
              Calculadora
            </TabsTrigger>
            <TabsTrigger value="chatbot" className="text-base font-semibold rounded-lg flex items-center gap-2 px-4">
              <MessageSquare />
              Dúvidas
            </TabsTrigger>
            <TabsTrigger value="profile" className="text-base font-semibold rounded-lg flex items-center gap-2 px-4">
              <Heart />
              Pets
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="calculator" className="mt-6">
          <PetNutritionCalculator 
            selectedPet={selectedPet} 
            pets={pets}
            setSelectedPetId={setSelectedPetId}
          />
        </TabsContent>
        <TabsContent value="chatbot" className="mt-6">
          <Chatbot />
        </TabsContent>
        <TabsContent value="profile" className="mt-6">
          <PetProfile 
            pets={pets} 
            setPets={setPets} 
            selectedPetId={selectedPetId} 
            setSelectedPetId={setSelectedPetId}
          />
        </TabsContent>
      </Tabs>
    </main>
  );
}
