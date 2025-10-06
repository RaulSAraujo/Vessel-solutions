import { serverSupabaseClient } from "#supabase/server";
import type { FetchError } from "ofetch"
import type { Tables } from '~~/server/types/database';

export default defineCachedEventHandler(async (event) => {
    try {
        const client = await serverSupabaseClient(event);

        const { data, error } = await client
            .from('units')
            .select('*')

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to fetch Supplier',
                message: error.message,
            });
        }

        return data as Tables<'units'>[];
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
}, {
    maxAge: 300,
    swr: true
});