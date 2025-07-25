import { PetNutritionCalculator } from '@/components/pet-nutrition-calculator';
import { Chatbot } from '@/components/chatbot';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dog, MessageSquare } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/10 via-background to-background">
      <Tabs defaultValue="calculator" className="w-full max-w-md mx-auto">
        <TabsList className="grid w-full grid-cols-2 h-12 rounded-xl p-1">
          <TabsTrigger value="calculator" className="text-base font-semibold rounded-lg flex items-center gap-2">
            <Dog />
            Calculadora
          </TabsTrigger>
          <TabsTrigger value="chatbot" className="text-base font-semibold rounded-lg flex items-center gap-2">
            <MessageSquare />
            Dúvidas
          </TabsTrigger>
        </TabsList>
        <TabsContent value="calculator" className="mt-6">
          <PetNutritionCalculator />
        </TabsContent>
        <TabsContent value="chatbot" className="mt-6">
          <Chatbot />
        </TabsContent>
      </Tabs>
    </main>
  );
}
