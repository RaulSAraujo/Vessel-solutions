import { getSupabaseClientAndUser } from '~~/server/utils/supabase';
import type { FetchError } from "ofetch";

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);
        const categoryId = event.context.params?.id;

        if (!categoryId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'Category ID is required.',
            });
        }

        const { error } = await client
            .from('drink_categories')
            .delete()
            .eq('id', categoryId);

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to delete category',
                message: error.message,
            });
        }

        return { message: `Category ${categoryId} deleted successfully.` };
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});