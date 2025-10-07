import type { FetchError } from "ofetch";
import type { Tables, TablesInsert } from "~~/server/types/database";

export default defineEventHandler(async (event) => {
    try {
        const { client, user } = await getSupabaseClientAndUser(event);

        const body = await readBody<TablesInsert<"events">>(event);

        // Basic validation
        if (
            !body.client_id ||
            !body.location ||
            !body.start_time ||
            !body.end_time ||
            !body.guest_count ||
            !body.distance ||
            !body.audience_profile
        ) {
            throw createError({
                statusCode: 400,
                statusMessage: "Bad Request",
                message: "Missing required event fields.",
            });
        }

        const estimated_total_drinks = await recalculateDrinkCost(body.audience_profile, body.start_time, body.end_time, body.guest_count);

        if (isNaN(estimated_total_drinks)) {
            throw createError({
                statusCode: 400,
                statusMessage: "Bad Request",
                message: "Invalid numeric values for event calculation.",
            });
        }

        const { data, error } = await client
            .from("events")
            .insert({
                ...body,
                estimated_total_drinks, // Adiciona o valor calculado
                user_id: user.id,
            })
            .select();

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: "Failed to create event",
                message: error.message,
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
