import { getSupabaseClientAndUser } from '~~/server/utils/supabase';
import type { FetchError } from "ofetch";
import type { Tables } from '~~/server/types/database';

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);
        const ingredientId = event.context.params?.id;

        if (!ingredientId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'Ingredient ID is required.',
            });
        }

        const { data, error } = await client
            .from('ingredients')
            .update({
                current_quotation_id: null,
                real_cost_per_base_unit: null
            })
            .eq('id', ingredientId)
            .select(`
                *,
                units (name,abbreviation)
            `);

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to update ingredient',
                message: error.message,
            });
        }

        if (!data || data.length === 0) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Not Found',
                message: `Ingredient with ID ${ingredientId} not found or not accessible for update.`,
            });
        }

        return data[0] as Tables<'ingredients'>;
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});