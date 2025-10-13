import { getSupabaseClientAndUser } from '~~/server/utils/supabase';
import type { FetchError } from "ofetch"
import type { Tables } from '~~/server/types/database';

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);

        const { data, error } = await client
            .from('drink_categories')
            .select('*')

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to fetch units',
                message: error.message,
            });
        }

        return data as Tables<'drink_categories'>[];
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});