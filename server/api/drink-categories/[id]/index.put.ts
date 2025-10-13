import { getSupabaseClientAndUser } from '~~/server/utils/supabase';
import type { FetchError } from "ofetch";
import type { Tables, TablesUpdate } from '~~/server/types/database';

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);
        const categoryId = event.context.params?.id;
        const body = await readBody<TablesUpdate<'drink_categories'>>(event);

        if (!categoryId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'category ID is required.',
            });
        }

        const updatedFields: TablesUpdate<'drink_categories'> = { ...body };

        const { data, error } = await client
            .from('drink_categories')
            .update(updatedFields)
            .eq('id', categoryId)
            .select();


        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to update drink category',
                message: error.message,
            });
        }

        if (!data || data.length === 0) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Not Found',
                message: `Supplier with ID ${categoryId} not found or not accessible for update.`,
            });
        }

        return data[0] as Tables<'drink_categories'>;
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});