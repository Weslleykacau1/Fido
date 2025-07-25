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
  breed: z.string().describe('A raça do cachorro (e.g., golden).'),
  ageInMonths: z.number().describe('A idade do cachorro em meses.'),
});
export type CalculateFoodAmountInput = z.infer<typeof CalculateFoodAmountInputSchema>;

const CalculateFoodAmountOutputSchema = z.object({
  foodAmountInGrams: z
    .number()
    .describe('A quantidade diária de ração calculada para o cachorro, em gramas.'),
});
export type CalculateFoodAmountOutput = z.infer<typeof CalculateFoodAmountOutputSchema>;

export async function calculateFoodAmount(input: CalculateFoodAmountInput): Promise<CalculateFoodAmountOutput> {
  return calculateFoodAmountFlow(input);
}

const racas = [
    {
      id: "labrador",
      nome: "Labrador Retriever",
      porte: "grande",
      peso_medio_kg: 30,
      energia: "alta",
      pelagem: "curta"
    },
    {
      id: "poodle",
      nome: "Poodle",
      porte: "médio",
      peso_medio_kg: 10,
      energia: "média",
      pelagem: "média"
    },
    {
      id: "shihtzu",
      nome: "Shih Tzu",
      porte: "pequeno",
      peso_medio_kg: 5,
      energia: "baixa",
      pelagem: "longa"
    },
    {
      id: "pinscher",
      nome: "Pinscher",
      porte: "pequeno",
      peso_medio_kg: 4,
      energia: "alta",
      pelagem: "curta"
    },
    {
      id: "golden",
      nome: "Golden Retriever",
      porte: "grande",
      peso_medio_kg: 32,
      energia: "alta",
      pelagem: "média"
    },
    {
      id: "bulldog",
      nome: "Bulldog Inglês",
      porte: "médio",
      peso_medio_kg: 23,
      energia: "baixa",
      pelagem: "curta"
    },
    {
      id: "beagle",
      nome: "Beagle",
      porte: "médio",
      peso_medio_kg: 12,
      energia: "alta",
      pelagem: "curta"
    },
    {
      id: "yorkshire",
      nome: "Yorkshire Terrier",
      porte: "pequeno",
      peso_medio_kg: 3,
      energia: "média",
      pelagem: "longa"
    },
    {
      id: "pastoralemao",
      nome: "Pastor Alemão",
      porte: "grande",
      peso_medio_kg: 35,
      energia: "alta",
      pelagem: "média"
    },
    {
      id: "rottweiler",
      nome: "Rottweiler",
      porte: "grande",
      peso_medio_kg: 45,
      energia: "média",
      pelagem: "curta"
    }
];

function buscarPesoPorRaca(idRaca: string) {
    const raca = racas.find(r => r.id === idRaca);
    return raca ? raca.peso_medio_kg : null;
}


const calculateFoodAmountFlow = ai.defineFlow(
  {
    name: 'calculateFoodAmountFlow',
    inputSchema: CalculateFoodAmountInputSchema,
    outputSchema: CalculateFoodAmountOutputSchema,
  },
  async input => {
    const {breed, ageInMonths} = input;
    const breedWeight = buscarPesoPorRaca(breed);

    if (!breedWeight) {
      const racaInfo = racas.find(r => r.id === breed);
      throw new Error(`Raça "${racaInfo ? racaInfo.nome : breed}" não encontrada na base de dados.`);
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
