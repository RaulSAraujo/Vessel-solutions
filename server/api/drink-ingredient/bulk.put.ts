import { getSupabaseClientAndUser } from '~~/server/utils/supabase';
import type { FetchError } from "ofetch";
import type { TablesUpdate } from '~~/server/types/database';

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);
        const body = await readBody<TablesUpdate<'drink_ingredients'>[]>(event);

        if (!body || body.length === 0) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'No drink ingredients provided.',
            });
        }

        const updates = body.map((ingredient) => ({
            id: ingredient.id,
            quantity: ingredient.quantity ?? 0,
        }));

        const { error } = await client.rpc('bulk_update_ingredients', {
            updates: updates,
        })

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to update drink',
                message: error.message,
            });
        }

        return true
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});