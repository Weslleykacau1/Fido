'use server';

import { calculateFoodAmount, CalculateFoodAmountInput } from '@/ai/flows/calculate-food-amount';

export async function getFoodAmount(input: CalculateFoodAmountInput): Promise<{ success: boolean; data?: { foodAmountInGrams: number }; error?: string; }> {
    try {
        const result = await calculateFoodAmount(input);
        return { success: true, data: result };
    } catch (error) {
        let errorMessage = 'An unexpected error occurred. Please try again.';
        if (error instanceof Error && error.message.includes('not found in database')) {
            errorMessage = `We couldn't find the breed "${input.breed}". Please check the spelling or try a similar breed.`;
        }
        console.error(error);
        return { success: false, error: errorMessage };
    }
}
