"use client";

import { useState, useEffect } from 'react';
import { PetNutritionCalculator } from '@/components/pet-nutrition-calculator';
import { Chatbot } from '@/components/chatbot';
import { PetProfile, Pet } from '@/components/pet-profile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dog, MessageSquare, User } from 'lucide-react';

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

  useEffect(() => {
    const savedPets = safelyParseJSON(localStorage.getItem('pets'), []);
    setPets(savedPets);
    if (savedPets.length > 0) {
      setSelectedPetId(savedPets[0].id);
    }
  }, []);

  useEffect(() => {
    if (pets.length > 0 || localStorage.getItem('pets')) {
      localStorage.setItem('pets', JSON.stringify(pets));
    }
  }, [pets]);

  const selectedPet = pets.find(p => p.id === selectedPetId) ?? null;

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/10 via-background to-background">
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
              <User />
              Perfil
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
