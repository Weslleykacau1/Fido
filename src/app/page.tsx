import { PetNutritionCalculator } from '@/components/pet-nutrition-calculator';
import { Chatbot } from '@/components/chatbot';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center gap-8 bg-background p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/10 via-background to-background">
      <PetNutritionCalculator />
      <Chatbot />
    </main>
  );
}
