'use server';

/**
 * @fileOverview This file defines a Genkit flow to calculate the recommended daily food amount for a dog based on its breed and age.
 *
 * - calculateFoodAmount - A function that takes dog breed and age as input and returns the calculated food amount in grams.
 * - CalculateFoodAmountInput - The input type for the calculateFoodAmount function.
 * - CalculateFoodAmountOutput - The return type for the calculateFoodAmount function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CalculateFoodAmountInputSchema = z.object({
  breed: z.string().describe('The breed of the dog (e.g., Golden Retriever).'),
  ageInMonths: z.number().describe('The age of the dog in months.'),
});
export type CalculateFoodAmountInput = z.infer<typeof CalculateFoodAmountInputSchema>;

const CalculateFoodAmountOutputSchema = z.object({
  foodAmountInGrams: z
    .number()
    .describe('The calculated daily food amount for the dog, in grams.'),
});
export type CalculateFoodAmountOutput = z.infer<typeof CalculateFoodAmountOutputSchema>;

export async function calculateFoodAmount(input: CalculateFoodAmountInput): Promise<CalculateFoodAmountOutput> {
  return calculateFoodAmountFlow(input);
}

const dogBreeds = {
  poodle: 6,
  labrador: 30,
  shihtzu: 5,
  'golden retriever': 32,
  pinscher: 4,
};

const calculateFoodAmountFlow = ai.defineFlow(
  {
    name: 'calculateFoodAmountFlow',
    inputSchema: CalculateFoodAmountInputSchema,
    outputSchema: CalculateFoodAmountOutputSchema,
  },
  async input => {
    const {breed, ageInMonths} = input;
    const breedWeight = dogBreeds[breed.toLowerCase() as keyof typeof dogBreeds];

    if (!breedWeight) {
      throw new Error(`Breed "${breed}" not found in database.`);
    }

    let gramsPerKg;
    if (ageInMonths <= 2) gramsPerKg = 20;
    else if (ageInMonths <= 6) gramsPerKg = 25;
    else if (ageInMonths <= 12) gramsPerKg = 22;
    else gramsPerKg = 15;

    const foodAmountInGrams = breedWeight * gramsPerKg;

    return {foodAmountInGrams};
  }
);
