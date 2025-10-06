import { getSupabaseClientAndUser } from '~~/server/utils/supabase';
import type { FetchError } from "ofetch";
import type { Tables, TablesUpdate } from '~~/server/types/database';

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);
        const quotationId = event.context.params?.id;
        const body = await readBody<TablesUpdate<'quotations'>>(event);

        if (!quotationId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'quotation ID is required.',
            });
        }

        const updatedFields: TablesUpdate<'quotations'> = { ...body };

        const { data, error } = await client
            .from('quotations')
            .update(updatedFields)
            .eq('id', quotationId)
            .select();


        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to update quotation',
                message: error.message,
            });
        }

        if (!data || data.length === 0) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Not Found',
                message: `quotation with ID ${quotationId} not found or not accessible for update.`,
            });
        }

        return data[0] as Tables<'quotations'>;
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});