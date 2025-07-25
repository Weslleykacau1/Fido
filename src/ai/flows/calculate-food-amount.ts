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
    { id: "caramelo", nome: "Caramelo (Vira-lata)", porte: "médio", peso_medio_kg: 18, energia: "média", pelagem: "curta" },
    { id: "labrador", nome: "Labrador Retriever", porte: "grande", peso_medio_kg: 30, energia: "alta", pelagem: "curta" },
    { id: "poodle", nome: "Poodle", porte: "médio", peso_medio_kg: 22, energia: "alta", pelagem: "encaracolada" },
    { id: "shihtzu", nome: "Shih Tzu", porte: "pequeno", peso_medio_kg: 6, energia: "baixa", pelagem: "longa" },
    { id: "pinscher", nome: "Pinscher", porte: "pequeno", peso_medio_kg: 4, energia: "alta", pelagem: "curta" },
    { id: "golden", nome: "Golden Retriever", porte: "grande", peso_medio_kg: 32, energia: "alta", pelagem: "longa" },
    { id: "bulldog", nome: "Bulldog Inglês", porte: "médio", peso_medio_kg: 23, energia: "baixa", pelagem: "curta" },
    { id: "beagle", nome: "Beagle", porte: "médio", peso_medio_kg: 12, energia: "alta", pelagem: "curta" },
    { id: "yorkshire", nome: "Yorkshire Terrier", porte: "pequeno", peso_medio_kg: 3, energia: "alta", pelagem: "longa" },
    { id: "pastoralemao", nome: "Pastor Alemão", porte: "grande", peso_medio_kg: 35, energia: "alta", pelagem: "dupla" },
    { id: "rottweiler", nome: "Rottweiler", porte: "grande", peso_medio_kg: 50, energia: "alta", pelagem: "curta" },
    { id: "boxer", nome: "Boxer", porte: "grande", peso_medio_kg: 30, energia: "alta", pelagem: "curta" },
    { id: "dachshund", nome: "Dachshund", porte: "pequeno", peso_medio_kg: 9, energia: "média", pelagem: "curta" },
    { id: "siberianhusky", nome: "Husky Siberiano", porte: "grande", peso_medio_kg: 25, energia: "alta", pelagem: "dupla" },
    { id: "doberman", nome: "Doberman", porte: "grande", peso_medio_kg: 40, energia: "alta", pelagem: "curta" },
    { id: "australianshepherd", nome: "Pastor Australiano", porte: "médio", peso_medio_kg: 25, energia: "alta", pelagem: "média" },
    { id: "schnauzer", nome: "Schnauzer", porte: "médio", peso_medio_kg: 18, energia: "média", pelagem: "dura" },
    { id: "chihuahua", nome: "Chihuahua", porte: "pequeno", peso_medio_kg: 2, energia: "média", pelagem: "curta" },
    { id: "pug", nome: "Pug", porte: "pequeno", peso_medio_kg: 7, energia: "baixa", pelagem: "curta" },
    { id: "pomeranian", nome: "Spitz Alemão (Pomerânia)", porte: "pequeno", peso_medio_kg: 3, energia: "média", pelagem: "longa" },
    { id: "bordercollie", nome: "Border Collie", porte: "médio", peso_medio_kg: 18, energia: "altíssima", pelagem: "média" },
    { id: "maltese", nome: "Maltês", porte: "pequeno", peso_medio_kg: 3, energia: "média", pelagem: "longa" },
    { id: "cockerspaniel", nome: "Cocker Spaniel", porte: "médio", peso_medio_kg: 13, energia: "alta", pelagem: "longa" },
    { id: "frenchbulldog", nome: "Buldogue Francês", porte: "pequeno", peso_medio_kg: 11, energia: "baixa", pelagem: "curta" },
    { id: "greatdane", nome: "Dogue Alemão", porte: "gigante", peso_medio_kg: 70, energia: "média", pelagem: "curta" },
    { id: "bernese", nome: "Boiadeiro Bernês", porte: "gigante", peso_medio_kg: 45, energia: "média", pelagem: "longa" },
    { id: "akita", nome: "Akita", porte: "grande", peso_medio_kg: 45, energia: "média", pelagem: "dupla" },
    { id: "bichonfrise", nome: "Bichon Frisé", porte: "pequeno", peso_medio_kg: 6, energia: "alta", pelagem: "encaracolada" },
    { id: "weimaraner", nome: "Weimaraner", porte: "grande", peso_medio_kg: 35, energia: "alta", pelagem: "curta" },
    { id: "dalmatian", nome: "Dálmata", porte: "grande", peso_medio_kg: 27, energia: "alta", pelagem: "curta" },
    { id: "bassetthound", nome: "Basset Hound", porte: "médio", peso_medio_kg: 25, energia: "baixa", pelagem: "curta" },
    { id: "shibainu", nome: "Shiba Inu", porte: "médio", peso_medio_kg: 10, energia: "alta", pelagem: "dupla" },
    { id: "stbernard", nome: "São Bernardo", porte: "gigante", peso_medio_kg: 80, energia: "baixa", pelagem: "longa" },
    { id: "vizsla", nome: "Vizsla", porte: "grande", peso_medio_kg: 25, energia: "alta", pelagem: "curta" },
    { id: "rhodesianridgeback", nome: "Rhodesian Ridgeback", porte: "grande", peso_medio_kg: 36, energia: "alta", pelagem: "curta" },
    { id: "canecorso", nome: "Cane Corso", porte: "grande", peso_medio_kg: 45, energia: "alta", pelagem: "curta" },
    { id: "bullterrier", nome: "Bull Terrier", porte: "médio", peso_medio_kg: 28, energia: "alta", pelagem: "curta" },
    { id: "staffordshirebullterrier", nome: "Staffordshire Bull Terrier", porte: "médio", peso_medio_kg: 15, energia: "alta", pelagem: "curta" },
    { id: "newfoundland", nome: "Terra Nova", porte: "gigante", peso_medio_kg: 65, energia: "baixa", pelagem: "longa" },
    { id: "englishsetter", nome: "Setter Inglês", porte: "grande", peso_medio_kg: 30, energia: "alta", pelagem: "longa" },
    { id: "irishwolfhound", nome: "Lébrel Irlandês", porte: "gigante", peso_medio_kg: 50, energia: "média", pelagem: "dura" },
    { id: "papillon", nome: "Papillon", porte: "pequeno", peso_medio_kg: 4, energia: "alta", pelagem: "longa" },
    { id: "samoyed", nome: "Samoieda", porte: "grande", peso_medio_kg: 25, energia: "média", pelagem: "dupla" },
    { id: "whippet", nome: "Whippet", porte: "médio", peso_medio_kg: 12, energia: "alta", pelagem: "curta" },
    { id: "pekingese", nome: "Pequinês", porte: "pequeno", peso_medio_kg: 5, energia: "baixa", pelagem: "longa" },
    { id: "bloodhound", nome: "Bloodhound", porte: "grande", peso_medio_kg: 45, energia: "média", pelagem: "curta" },
    { id: "chowchow", nome: "Chow Chow", porte: "médio", peso_medio_kg: 28, energia: "baixa", pelagem: "dupla" },
    { id: "jackrussell", nome: "Jack Russell Terrier", porte: "pequeno", peso_medio_kg: 7, energia: "altíssima", pelagem: "curta" },
    { id: "sharpei", nome: "Shar Pei", porte: "médio", peso_medio_kg: 25, energia: "baixa", pelagem: "curta" },
    { id: "westie", nome: "West Highland White Terrier", porte: "pequeno", peso_medio_kg: 8, energia: "média", pelagem: "dura" },
    { id: "cavalierkingcharles", nome: "Cavalier King Charles Spaniel", porte: "pequeno", peso_medio_kg: 7, energia: "média", pelagem: "longa" }
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
