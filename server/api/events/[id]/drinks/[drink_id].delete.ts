import { getSupabaseClientAndUser } from '~~/server/utils/supabase';
import type { FetchError } from "ofetch";

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);
        const eventId = event.context.params?.id;
        const drinkId = event.context.params?.drink_id;

        if (!eventId || !drinkId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'Event and Drink ID is required.',
            });
        }

        const { error } = await client
            .from('event_drinks')
            .delete()
            .eq('event_id', eventId)
            .eq('drink_id', drinkId);

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to delete drink',
                message: error.message,
            });
        }

        return { message: `Drink Ingredient deleted successfully.` };
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});