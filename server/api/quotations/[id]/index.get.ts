import { getSupabaseClientAndUser } from '~~/server/utils/supabase';
import type { FetchError } from "ofetch"
import type { Tables } from '~~/server/types/database';

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

        const { data, error } = await client
            .from('quotations')
            .select('*')
            .eq('id', quotationId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                throw createError({
                    statusCode: 404,
                    statusMessage: 'Not Found',
                    message: `quotation with ID ${quotationId} not found or not accessible.`,
                });
            }
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to fetch quotation',
                message: error.message,
            });
        }

        return data as Tables<'quotations'>;
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});