'use server';

/**
 * @fileOverview This file defines a Genkit flow to generate a detailed feeding plan for a dog.
 *
 * - generateFeedingPlan - A function that takes dog details and returns a structured feeding plan.
 * - GenerateFeedingPlanInput - The input type for the generateFeeding-plan function.
 * - GenerateFeedingPlanOutput - The return type for the generate-plan function.
 */

import {ai} from '@/ai/genkit';
import { GenerateFeedingPlanInputSchema, GenerateFeedingPlanOutputSchema, GenerateFeedingPlanInput, GenerateFeedingPlanOutput } from '@/app/schemas';


export async function generateFeedingPlan(input: GenerateFeedingPlanInput): Promise<GenerateFeedingPlanOutput> {
  return generateFeedingPlanFlow(input);
}


const prompt = ai.definePrompt({
  name: 'generateFeedingPlanPrompt',
  input: { schema: GenerateFeedingPlanInputSchema },
  output: { schema: GenerateFeedingPlanOutputSchema },
  prompt: `Você é um nutricionista veterinário especialista. Sua tarefa é criar um plano de alimentação diário detalhado para um cão.

**Informações do Cão:**
*   Nome: {{{dogName}}}
*   Raça: {{{breed}}}
*   Idade: {{{ageInMonths}}} meses
*   Peso: {{{weightInKg}}} kg
*   Quantidade Diária Total de Ração: {{{dailyFoodAmountGrams}}} gramas

**Instruções:**
1.  **Divida as Refeições:** Com base na idade, divida a quantidade diária total de ração ({{{dailyFoodAmountGrams}}}g) em refeições apropriadas.
    *   Filhotes (até 6 meses): 3 refeições (manhã, almoço, noite).
    *   Cães jovens (7 a 12 meses): 2 ou 3 refeições.
    *   Adultos (acima de 12 meses): 2 refeições (manhã, noite).
2.  **Defina Horários:** Sugira horários consistentes para cada refeição.
3.  **Calcule as Porções:** Calcule a quantidade em gramas para cada refeição. A soma das porções deve ser igual à quantidade diária total.
4.  **Gere Recomendações:** Forneça 3-4 dicas curtas e úteis como uma lista de strings.
    *   **Dica Obrigatória sobre Pesagem:** Adicione uma recomendação específica sobre quando pesar o cão novamente.
        *   Se o cão for filhote (até 12 meses de idade), recomende a **pesagem semanal**.
        *   Se o cão for adulto (acima de 12 meses), recomende a **pesagem mensal**.
    *   **Outras Dicas:** Inclua uma recomendação sobre a importância de água fresca e limpa sempre disponível. Mencione que o tipo de ração (filhote, adulto, sênior) deve ser apropriado para a idade.
5.  **Formato de Saída:** Retorne os dados estritamente no formato JSON definido no esquema de saída, com as recomendações como um array de strings.

**Exemplo de Raciocínio:**
Se o cão tem 4 meses e a porção diária é 300g, eu devo dividir em 3 refeições de 100g cada. Sugiro horários como 08:00, 13:00 e 19:00. Depois, escrevo as recomendações em uma lista. Como ele é filhote, uma das recomendações será: "Acompanhe o crescimento pesando seu cão semanalmente."

Execute a tarefa para o cão informado.`,
});


const generateFeedingPlanFlow = ai.defineFlow(
  {
    name: 'generateFeedingPlanFlow',
    inputSchema: GenerateFeedingPlanInputSchema,
    outputSchema: GenerateFeedingPlanOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
