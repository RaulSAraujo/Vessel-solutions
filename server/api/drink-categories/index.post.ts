import { getSupabaseClientAndUser } from '~~/server/utils/supabase';
import type { FetchError } from "ofetch";
import type { Tables, TablesInsert } from '~~/server/types/database';

export default defineEventHandler(async (event) => {
    try {
        const { client, user } = await getSupabaseClientAndUser(event);
        const body = await readBody<TablesInsert<'drink_categories'>>(event);

        const { data, error } = await client
            .from('drink_categories')
            .insert({
                ...body,
                user_id: user.id,
            })
            .select();

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to create drink category',
                message: error.message,
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