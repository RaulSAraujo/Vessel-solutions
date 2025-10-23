import type { FetchError } from "ofetch";
import type { TablesUpdate } from "~~/server/types/database";
import { recalculatePurchaseListForEvent } from "~~/server/utils/purchaseListGenerator";

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);
        const eventDrinkId = event.context.params?.id;

        const body = await readBody<TablesUpdate<"event_drinks">>(event);

        if (!eventDrinkId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'Event drink ID is required.',
            });
        }

        // Buscar o event_drink atual para verificar mudanças
        const { data: currentEventDrink } = await client
            .from('event_drinks')
            .select(`
                event_id,
                drink_name,
                drink_percentage
            `)
            .eq('id', eventDrinkId)
            .single();

        const { data, error } = await client
            .from('event_drinks')
            .update(body)
            .eq('id', eventDrinkId)
            .select('*');

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to update event drink',
                message: error.message,
            });
        }

        if (!data || data.length === 0) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Not Found',
                message: `Event drink with ID ${eventDrinkId} not found or not accessible for update.`,
            });
        }

        const updatedEventDrink = data[0];

        // Se o drink foi alterado ou a porcentagem mudou, recalcular a purchase-list
        if (currentEventDrink &&
            (body.drink_name !== currentEventDrink.drink_name ||
                body.drink_percentage !== currentEventDrink.drink_percentage)) {

            await recalculatePurchaseListForEvent(client, currentEventDrink.event_id);
        }

        return updatedEventDrink;
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});

