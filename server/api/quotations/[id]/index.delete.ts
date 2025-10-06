import { getSupabaseClientAndUser } from '~~/server/utils/supabase';
import type { FetchError } from "ofetch";

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);
        const quotationId = event.context.params?.id;

        if (!quotationId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'quotation ID is required.',
            });
        }

        const { error } = await client
            .from('quotations')
            .delete()
            .eq('id', quotationId);

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to delete quotation',
                message: error.message,
            });
        }

        return { message: `quotation ${quotationId} deleted successfully.` };
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});