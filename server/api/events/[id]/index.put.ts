import type { FetchError } from "ofetch";
import type { TablesUpdate } from "~~/server/types/database";

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);
        const eventId = event.context.params?.id;

        const body = await readBody<TablesUpdate<"events">>(event);

        if (!eventId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'Event ID is required.',
            });
        }

        const { data, error } = await client
            .from('events')
            .update(body)
            .eq('id', eventId)
            .select(`
                *,
                clients!inner (name)
            `);

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

        return data[0];
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});