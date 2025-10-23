import { getSupabaseClientAndUser } from '~~/server/utils/supabase';
import { recalculatePurchaseListForEvent } from "~~/server/utils/purchaseListGenerator";
import type { FetchError } from "ofetch";
import type { Tables, TablesInsert } from '~~/server/types/database';

type EventDrink = Tables<"event_drinks">;

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

        // Buscar drinks atuais para comparar mudanças
        const { data: currentEventDrinks } = await client
            .from('event_drinks')
            .select('drink_name, drink_percentage')
            .eq('event_id', eventId);

        const drinksData = body.map((drink) => ({
            id: drink.id,
            event_id: eventId,
            drink_percentage: drink.drink_percentage,
            drink_name: drink.drink_name,
            drink_category_name: drink.drink_category_name,
            drink_description: drink.drink_description,
            drink_image_url: drink.drink_image_url,
            drink_calculated_cost: drink.drink_calculated_cost,
            drink_selling_price: drink.drink_selling_price,
            drink_profit_margin_percentage: drink.drink_profit_margin_percentage,
        }));

        const { data, error: upsertError } = await client.rpc('upsert_multiple_event_drinks', {
            p_event_id: eventId,
            p_drinks: drinksData
        });

        if (upsertError) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to upsert event drinks',
                message: upsertError.message,
            });
        }

        // Verificar se houve mudanças nas porcentagens dos drinks
        let hasPercentageChanges = false;

        if (currentEventDrinks && currentEventDrinks.length > 0) {
            // Comparar porcentagens dos drinks
            for (const newDrink of body) {
                const currentDrink = currentEventDrinks.find(
                    cd => cd.drink_name === newDrink.drink_name
                );

                if (currentDrink && currentDrink.drink_percentage !== newDrink.drink_percentage) {
                    hasPercentageChanges = true;
                    break;
                }
            }
        } else {
            // Se não havia drinks antes, considerar como mudança
            hasPercentageChanges = true;
        }

        // Recalcular purchase-list se houve mudanças nas porcentagens
        if (hasPercentageChanges) {
            await recalculatePurchaseListForEvent(client, eventId);
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