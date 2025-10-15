import { getSupabaseClientAndUser } from '~~/server/utils/supabase';
import type { FetchError } from "ofetch";
import type { Tables, TablesInsert } from '~~/server/types/database';

type EventDrinkWithRelation = Tables<"event_drinks"> & {
    drinks: Tables<"drinks"> & {
        drink_categories: {
            name: string;
        }
    }
}

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);
        const eventId = event.context.params?.id;
        const body = await readBody<TablesInsert<'event_drinks'>[]>(event);

        if (!eventId) {
            throw createError({
                statusCode: 400,
                statusMessage: "Bad Request",
                message: "Event ID is required.",
            });
        }

        if (!body || body.length === 0) {
            throw createError({
                statusCode: 400,
                statusMessage: "Bad Request",
                message: "At least one drink is required.",
            });
        }

        const drinks = body.map((drink) => ({
            event_id: eventId,
            drink_id: drink.drink_id,
            drink_percentage: drink.drink_percentage,
        }));

        const { data, error: drinksError } = await client.rpc('upsert_multiple_event_drinks', {
            _event_drinks: drinks
        })

        if (drinksError) {
            throw createError({
                statusCode: 500,
                statusMessage: "Failed to add ingredients",
                message: drinksError.message,
            });
        }

        return data as EventDrinkWithRelation[];
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});