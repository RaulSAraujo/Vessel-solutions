import { getSupabaseClientAndUser } from '~~/server/utils/supabase';
import type { FetchError } from "ofetch";
import type { TablesUpdate } from "~~/server/types/database";

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);
        const id = getRouterParam(event, 'id');
        const body = await readBody<TablesUpdate<'event_quotations'>>(event);

        if (!id) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'ID is required',
            });
        }

        // Atualizar o evento principal
        const { error: eventQuotationError } = await client
            .from('event_quotations')
            .update(body)
            .eq('id', id);

        if (eventQuotationError) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to update event quotation',
                message: eventQuotationError.message,
            });
        }

        // Buscar o evento atualizado
        const { data: updatedEventQuotation, error: fetchError } = await client
            .from('event_quotations')
            .select('*')
            .eq('id', id)
            .single();

        if (fetchError) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to fetch updated event quotation',
                message: fetchError.message,
            });
        }

        return updatedEventQuotation;
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});
