'use server';

import { calculateFoodAmount, CalculateFoodAmountInput } from '@/ai/flows/calculate-food-amount';
import { chat } from '@/ai/flows/chatbot';
import { generateFeedingPlan } from '@/ai/flows/generate-feeding-plan';
import { z } from 'zod';
import { GenerateFeedingPlanInput } from './schemas';


const ChatInputSchema = z.object({
  question: z.string().describe('A pergunta do usuário.'),
  history: z.array(z.object({
    user: z.string(),
    bot: z.string(),
  })).describe('O histórico da conversa.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;


export async function getFoodAmount(input: CalculateFoodAmountInput): Promise<{ success: boolean; data?: { foodAmountInGrams: number }; error?: string; }> {
    try {
        const result = await calculateFoodAmount(input);
        return { success: true, data: result };
    } catch (error) {
        let errorMessage = 'Ocorreu um erro inesperado. Por favor, tente novamente.';
        if (error instanceof Error && error.message.includes('não encontrada na base de dados')) {
            errorMessage = error.message;
        }
        console.error(error);
        return { success: false, error: errorMessage };
    }
}

export async function getChatResponse(input: ChatInput): Promise<{ success: boolean; data?: { answer: string }; error?: string; }> {
    try {
        const result = await chat(input);
        return { success: true, data: result };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Desculpe, não consegui processar sua pergunta. Tente novamente.' };
    }
}

export async function getFeedingPlan(input: GenerateFeedingPlanInput) {
    try {
        const result = await generateFeedingPlan(input);
        return { success: true, data: result };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Desculpe, não consegui gerar o plano de alimentação. Tente novamente.' };
    }
}
