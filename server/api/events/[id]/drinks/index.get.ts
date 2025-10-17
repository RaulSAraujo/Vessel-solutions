import { getSupabaseClientAndUser } from "~~/server/utils/supabase";
import type { FetchError } from "ofetch";
import type { Tables } from "~~/server/types/database";

type EventDrink = Tables<"event_drinks">;

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);

        const eventId = event.context.params?.id;

        if (!eventId) {
            throw createError({
                statusCode: 400,
                statusMessage: "Bad Request",
                message: "Event ID is required.",
            });
        }

        const { data, error } = await client
            .from("event_drinks")
            .select("*")
            .eq("event_id", eventId)
            .order("created_at", { ascending: true });

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: "Failed to fetch event drinks",
                message: error.message,
            });
        }

        return data as EventDrink[];
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});
