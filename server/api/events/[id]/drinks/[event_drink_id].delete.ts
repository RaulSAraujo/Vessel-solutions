import { getSupabaseClientAndUser } from '~~/server/utils/supabase';
import type { FetchError } from "ofetch";

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);
        const eventId = event.context.params?.id;
        const eventDrinkId = event.context.params?.event_drink_id;

        if (!eventId || !eventDrinkId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'Event and Event Drink ID is required.',
            });
        }

        const { error } = await client
            .from('event_drinks')
            .delete()
            .eq('id', eventDrinkId)
            .eq('event_id', eventId);

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to delete drink',
                message: error.message,
            });
        }

        return { message: `Event drink deleted successfully.` };
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});