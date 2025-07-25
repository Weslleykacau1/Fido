import { PetNutritionCalculator } from '@/components/pet-nutrition-calculator';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-background p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/10 via-background to-background">
      <PetNutritionCalculator />
    </main>
  );
}
