import { getSupabaseClientAndUser } from '~~/server/utils/supabase';
import type { FetchError } from "ofetch";

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

        const { error } = await client
            .from('suppliers')
            .delete()
            .eq('id', supplierId);

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to delete Supplier',
                message: error.message,
            });
        }

        return { message: `Supplier ${supplierId} deleted successfully.` };
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});