import { getSupabaseClientAndUser } from '~~/server/utils/supabase';
import type { FetchError } from "ofetch";

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);
        const id = getRouterParam(event, 'id');

        if (!id) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'ID is required',
            });
        }

        // Deletar as bebidas do orçamento primeiro
        const { error: drinksError } = await client
            .from('event_quotation_drinks')
            .delete()
            .eq('event_quotation_id', id);

        if (drinksError) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to delete event quotation drinks',
                message: drinksError.message,
            });
        }

        // Deletar o orçamento principal
        const { error: quotationError } = await client
            .from('event_quotations')
            .delete()
            .eq('id', id);

        if (quotationError) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to delete event quotation',
                message: quotationError.message,
            });
        }

        return { success: true };
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});
