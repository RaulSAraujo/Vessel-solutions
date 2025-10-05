import { getSupabaseClientAndUser } from '~~/server/utils/supabase';
import type { FetchError } from "ofetch";
import type { Tables, TablesUpdate } from '~~/server/types/database';

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);
        const supplierId = event.context.params?.id;
        const body = await readBody<TablesUpdate<'suppliers'>>(event);

        if (!supplierId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'Supplier ID is required.',
            });
        }

        const updatedFields: TablesUpdate<'suppliers'> = { ...body };

        const { data, error } = await client
            .from('suppliers')
            .update(updatedFields)
            .eq('id', supplierId)
            .select();


        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to update Supplier',
                message: error.message,
            });
        }

        if (!data || data.length === 0) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Not Found',
                message: `Supplier with ID ${supplierId} not found or not accessible for update.`,
            });
        }

        return data[0] as Tables<'suppliers'>;
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});