import type { FetchError } from "ofetch";
import type { Tables, TablesInsert } from "~~/server/types/database";

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);
        const eventId = event.context.params?.id;

        const body = await readBody<TablesInsert<"events">>(event);

        if (!eventId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'Event ID is required.',
            });
        }

        const estimated_total_drinks = await recalculateDrinkCost(body.audience_profile, body.start_time, body.end_time, body.guest_count);

        const { data, error } = await client
            .from('events')
            .update({
                ...body,
                estimated_total_drinks
            })
            .eq('id', eventId)
            .select();

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to update event',
                message: error.message,
            });
        }

        if (!data || data.length === 0) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Not Found',
                message: `Event with ID ${eventId} not found or not accessible for update.`,
            });
        }

        return data[0] as Tables<"events">;
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});