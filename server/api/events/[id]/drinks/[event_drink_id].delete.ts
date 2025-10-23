import { getSupabaseClientAndUser } from '~~/server/utils/supabase';
import { cleanupPurchaseListAfterDrinkRemoval } from "~~/server/utils/purchaseListGenerator";
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

        // Buscar o event_drink antes de deletar para obter informações
        const { data: eventDrink, error: selectError } = await client
            .from('event_drinks')
            .select(`
                drink_name,
                events!inner (user_id)
            `)
            .eq('id', eventDrinkId)
            .eq('event_id', eventId)
            .single();

        if (selectError) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to fetch event drink',
                message: selectError.message,
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

        // Limpar itens da purchase-list que não são mais necessários
        if (eventDrink.drink_name && eventDrink.events.user_id) {
            await cleanupPurchaseListAfterDrinkRemoval(client, eventId, eventDrink.drink_name, eventDrink.events.user_id);
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