import { getSupabaseClientAndUser } from '~~/server/utils/supabase';
import type { FetchError } from "ofetch";

export default defineEventHandler(async (event) => {
    try {
        const { client, user } = await getSupabaseClientAndUser(event);
        const eventQuotationDrinkId = getRouterParam(event, 'event_quotation_drink_id');

        if (!eventQuotationDrinkId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'Event quotation drink ID is required',
            });
        }

        // Verificar se o drink pertence ao usuário
        const { data: eventQuotationDrink, error: fetchError } = await client
            .from('event_quotation_drinks')
            .select(`
                id,
                event_quotations!inner (
                    user_id
                )
            `)
            .eq('id', eventQuotationDrinkId)
            .eq('event_quotations.user_id', user.id)
            .single();

        if (fetchError || !eventQuotationDrink) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Not Found',
                message: 'Event quotation drink not found or access denied',
            });
        }

        const { error } = await client
            .from('event_quotation_drinks')
            .delete()
            .eq('id', eventQuotationDrinkId);

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to delete event quotation drink',
                message: error.message,
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
