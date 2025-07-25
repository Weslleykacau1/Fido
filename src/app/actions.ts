'use server';

import { calculateFoodAmount, CalculateFoodAmountInput } from '@/ai/flows/calculate-food-amount';

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
