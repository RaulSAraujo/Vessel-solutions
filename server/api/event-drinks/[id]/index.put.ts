import type { FetchError } from "ofetch";
import type { TablesUpdate } from "~~/server/types/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import { generatePurchaseListItems } from "~~/server/utils/purchaseListGenerator";

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
                drink_percentage,
                events!inner (user_id)
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

        // Se o drink foi alterado ou a porcentagem mudou, regenerar a purchase-list
        if (currentEventDrink &&
            (body.drink_name !== currentEventDrink.drink_name ||
                body.drink_percentage !== currentEventDrink.drink_percentage)) {

            // Limpar itens antigos da purchase-list para este drink
            if (body.drink_name !== currentEventDrink.drink_name && currentEventDrink.drink_name && currentEventDrink.events.user_id) {
                await cleanupOldDrinkItems(client, currentEventDrink.event_id, currentEventDrink.drink_name, currentEventDrink.events.user_id);
            }

            // Regenerar itens da purchase-list para o evento
            if (currentEventDrink.events.user_id) {
                await regeneratePurchaseListForEvent(client, currentEventDrink.event_id, currentEventDrink.events.user_id);
            }
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

// Função para limpar itens de um drink específico
async function cleanupOldDrinkItems(client: SupabaseClient, eventId: string, drinkName: string, userId: string) {
    try {
        // Buscar ingredientes do drink antigo
        const { data: oldDrink } = await client
            .from('drinks')
            .select(`
                drink_ingredients (
                    ingredient_id,
                    unit_id
                )
            `)
            .eq('name', drinkName)
            .eq('user_id', userId)
            .single();

        if (!oldDrink || !oldDrink.drink_ingredients) {
            return;
        }

        // Para cada ingrediente do drink antigo, verificar se ainda é usado
        for (const drinkIngredient of oldDrink.drink_ingredients) {
            // Verificar se este ingrediente ainda é usado por outros drinks do evento
            const { data: eventDrinks } = await client
                .from('event_drinks')
                .select('drink_name')
                .eq('event_id', eventId);

            if (!eventDrinks || eventDrinks.length === 0) {
                continue;
            }

            let ingredientStillUsed = false;

            for (const eventDrink of eventDrinks) {
                const { data: otherDrink } = await client
                    .from('drinks')
                    .select(`
                        drink_ingredients!inner (
                            ingredient_id
                        )
                    `)
                    .eq('name', eventDrink.drink_name)
                    .eq('user_id', userId)
                    .single();

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if (otherDrink && otherDrink.drink_ingredients.some((di: any) => di.ingredient_id === drinkIngredient.ingredient_id)) {
                    ingredientStillUsed = true;
                    break;
                }
            }

            // Se o ingrediente não é mais usado, remover da purchase-list
            if (!ingredientStillUsed) {
                await client
                    .from('purchase_list')
                    .delete()
                    .eq('event_id', eventId)
                    .eq('ingredient_id', drinkIngredient.ingredient_id)
                    .eq('unit_id', drinkIngredient.unit_id);
            }
        }
    } catch (error) {
        console.error('Erro ao limpar itens do drink antigo:', error);
    }
}

// Função para regenerar purchase-list para um evento
async function regeneratePurchaseListForEvent(client: SupabaseClient, eventId: string, _userId: string) {
    try {
        // Buscar dados do evento
        const { data: eventData } = await client
            .from('events')
            .select('*')
            .eq('id', eventId)
            .single();

        if (!eventData) {
            return;
        }

        // Limpar purchase-list existente para este evento
        await client
            .from('purchase_list')
            .delete()
            .eq('event_id', eventId);

        // Regenerar purchase-list
        await generatePurchaseListItems(client, eventId, eventData);
    } catch (error) {
        console.error('Erro ao regenerar purchase-list:', error);
    }
}

