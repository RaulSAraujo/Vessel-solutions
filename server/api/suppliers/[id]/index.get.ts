import { getSupabaseClientAndUser } from '~~/server/utils/supabase';
import type { FetchError } from "ofetch"
import type { Tables } from '~~/server/types/database';

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);
        const supplierId = event.context.params?.id;

        if (!supplierId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'Supplier ID is required.',
            });
        }

        const { data, error } = await client
            .from('suppliers')
            .select('*')
            .eq('id', supplierId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                throw createError({
                    statusCode: 404,
                    statusMessage: 'Not Found',
                    message: `Supplier with ID ${supplierId} not found or not accessible.`,
                });
            }
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to fetch Supplier',
                message: error.message,
            });
        }

        return data as Tables<'suppliers'>;
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});