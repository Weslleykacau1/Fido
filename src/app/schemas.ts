
import { z } from 'zod';

export const GenerateFeedingPlanInputSchema = z.object({
  dogName: z.string().describe('O nome do cachorro.'),
  breed: z.string().describe('A raça do cachorro.'),
  ageInMonths: z.number().describe('A idade do cachorro em meses.'),
  weightInKg: z.number().describe('O peso do cachorro em quilogramas.'),
  dailyFoodAmountGrams: z.number().describe('A quantidade diária de ração já calculada em gramas.'),
});
export type GenerateFeedingPlanInput = z.infer<typeof GenerateFeedingPlanInputSchema>;

export const GenerateFeedingPlanOutputSchema = z.object({
  plan: z.object({
    meals: z.array(z.object({
        mealName: z.string().describe('O nome da refeição (ex: Café da Manhã, Almoço, Jantar).'),
        time: z.string().describe('O horário sugerido para a refeição (ex: "08:00").'),
        portionGrams: z.number().describe('A porção em gramas para esta refeição.'),
      })
    ).describe('Uma lista das refeições diárias.'),
    recommendations: z.array(z.string()).describe('Uma lista de recomendações nutricionais e dicas para a saúde do cão.'),
  })
});
export type GenerateFeedingPlanOutput = z.infer<typeof GenerateFeedingPlanOutputSchema>;


export const FindVetsInputSchema = z.object({
  city: z.string().describe('O nome da cidade para buscar clínicas veterinárias.'),
});
export type FindVetsInput = z.infer<typeof FindVetsInputSchema>;

const VetSchema = z.object({
    name: z.string().describe('O nome da clínica veterinária.'),
    address: z.string().describe('O endereço completo da clínica.'),
    phone: z.string().optional().describe('O número de telefone da clínica.'),
});

export const FindVetsOutputSchema = z.object({
  vets: z.array(VetSchema).describe('Uma lista de clínicas veterinárias encontradas.'),
});
export type FindVetsOutput = z.infer<typeof FindVetsOutputSchema>;
