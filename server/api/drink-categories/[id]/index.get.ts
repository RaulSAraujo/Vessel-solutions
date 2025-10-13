import { getSupabaseClientAndUser } from '~~/server/utils/supabase';
import type { FetchError } from "ofetch"
import type { Tables } from '~~/server/types/database';

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

        const { data, error } = await client
            .from('drink_categories')
            .select('*')
            .eq('id', categoryId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                throw createError({
                    statusCode: 404,
                    statusMessage: 'Not Found',
                    message: `Category with ID ${categoryId} not found or not accessible.`,
                });
            }
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to fetch category',
                message: error.message,
            });
        }

        return data as Tables<'drink_categories'>;
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});