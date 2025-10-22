import { getSupabaseClientAndUser } from '~~/server/utils/supabase';
import type { FetchError } from "ofetch";
import type { TablesInsert } from "~~/server/types/database";

export default defineEventHandler(async (event) => {
    try {
        const { client, user } = await getSupabaseClientAndUser(event);
        const body = await readBody<TablesInsert<'event_quotations'>>(event);

        // Criar o evento principal
        const { data: eventQuotationData, error: eventQuotationError } = await client
            .from('event_quotations')
            .insert({
                ...body,
                user_id: user.id,
            })
            .select()
            .single();

        if (eventQuotationError) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to create event quotation',
                message: eventQuotationError.message,
            });
        }

        return eventQuotationData;
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});
