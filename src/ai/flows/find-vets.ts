
'use server';

/**
 * @fileOverview This file defines a Genkit flow for finding veterinary clinics in a given city using AI.
 *
 * - findVets - A function that takes a city name and returns a list of vet clinics.
 */

import {ai} from '@/ai/genkit';
import { FindVetsInputSchema, FindVetsOutputSchema, FindVetsInput, FindVetsOutput } from '@/app/schemas';


export async function findVets(input: FindVetsInput): Promise<FindVetsOutput> {
  return findVetsFlow(input);
}


const prompt = ai.definePrompt({
  name: 'findVetsPrompt',
  input: { schema: FindVetsInputSchema },
  output: { schema: FindVetsOutputSchema },
  prompt: `Você é um assistente de busca local. Sua tarefa é encontrar clínicas veterinárias e hospitais veterinários 24 horas na cidade fornecida pelo usuário.

**Cidade para a busca:**
{{{city}}}

**Instruções:**
1.  **Priorize 24 horas:** Dê preferência a clínicas e hospitais que funcionam 24 horas.
2.  **Pesquise na Web:** Use suas habilidades de pesquisa para encontrar informações atualizadas e precisas.
3.  **Formato de Saída:** Retorne uma lista de até 10 clínicas. Para cada clínica, forneça o nome, endereço completo e, se possível, o número de telefone.
4.  **Estrutura JSON:** Retorne os dados estritamente no formato JSON definido no esquema de saída. Se nenhuma clínica for encontrada, retorne um array 'vets' vazio.

Execute a busca para a cidade informada.`,
});


const findVetsFlow = ai.defineFlow(
  {
    name: 'findVetsFlow',
    inputSchema: FindVetsInputSchema,
    outputSchema: FindVetsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
