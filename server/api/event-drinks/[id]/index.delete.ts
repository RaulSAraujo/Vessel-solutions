import { cleanupPurchaseListAfterDrinkRemoval } from "~~/server/utils/purchaseListGenerator";
import type { FetchError } from "ofetch";

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);
        const eventDrinkId = event.context.params?.id;

        if (!eventDrinkId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'Event drink ID is required.',
            });
        }

        // Buscar o event_drink antes de deletar para obter informações
        const { data: eventDrink, error: selectError } = await client
            .from('event_drinks')
            .select(`
                event_id,
                drink_name,
                events!inner (user_id)
            `)
            .eq('id', eventDrinkId)
            .single();

        if (selectError) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to fetch event drink',
                message: selectError.message,
            });
        }

        // Deletar o event_drink
        const { error } = await client
            .from('event_drinks')
            .delete()
            .eq('id', eventDrinkId);

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to delete event drink',
                message: error.message,
            });
        }

        // Limpar itens da purchase-list que não são mais necessários
        if (eventDrink.drink_name && eventDrink.events.user_id) {
            await cleanupPurchaseListAfterDrinkRemoval(client, eventDrink.event_id, eventDrink.drink_name, eventDrink.events.user_id);
        }

        return { message: `Event drink ${eventDrinkId} deleted successfully.` };
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});
