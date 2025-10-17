import { getSupabaseClientAndUser } from '~~/server/utils/supabase';
import type { FetchError } from "ofetch";

export default defineEventHandler(async (event) => {
    try {
        const { client, user } = await getSupabaseClientAndUser(event);
        const id = getRouterParam(event, 'id');

        if (!id) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'ID is required',
            });
        }

        // Verificar se o event_quotation pertence ao usuário
        const { data: eventQuotation, error: fetchError } = await client
            .from('event_quotations')
            .select('id, user_id')
            .eq('id', id)
            .eq('user_id', user.id)
            .single();

        if (fetchError || !eventQuotation) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Not Found',
                message: 'Event quotation not found or access denied',
            });
        }

        const { data, error } = await client
            .from('event_quotation_drinks')
            .select('*')
            .eq('event_quotation_id', id)
            .order('created_at', { ascending: true });

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to fetch event quotation drinks',
                message: error.message,
            });
        }

        return data;
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});
