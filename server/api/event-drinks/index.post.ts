import type { FetchError } from "ofetch";
import type { TablesInsert } from "~~/server/types/database";
import { generatePurchaseListForNewDrink } from "~~/server/utils/purchaseListGenerator";

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);
        const body = await readBody<TablesInsert<"event_drinks">>(event);

        const { data, error } = await client
            .from('event_drinks')
            .insert(body)
            .select('*');

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to create event drink',
                message: error.message,
            });
        }

        if (!data || data.length === 0) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to create event drink',
                message: 'No data returned after insertion.',
            });
        }

        const newEventDrink = data[0];
        if (!newEventDrink) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to create event drink',
                message: 'No data returned after insertion.',
            });
        }

        // Se o evento já está com status 'purchase', gerar itens da purchase-list
        const { data: eventData } = await client
            .from('events')
            .select('status, user_id')
            .eq('id', body.event_id)
            .single();

        if (eventData && eventData.status === 'purchase' && newEventDrink.drink_name) {
            await generatePurchaseListForNewDrink(client, body.event_id, newEventDrink);
        }

        return newEventDrink;
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});
