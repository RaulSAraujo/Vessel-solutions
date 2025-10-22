import type { FetchError } from "ofetch";
import type { SupabaseClient } from "@supabase/supabase-js";

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
        await cleanupPurchaseListItems(client, eventDrink.event_id, eventDrink.drink_name, eventDrink.events.user_id);

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

// Função para limpar itens da purchase-list quando um drink é removido
async function cleanupPurchaseListItems(client: SupabaseClient, eventId: string, removedDrinkName: string, userId: string) {
    try {
        // Buscar o drink removido para obter seus ingredientes
        const { data: drink } = await client
            .from('drinks')
            .select(`
                drink_ingredients (
                    ingredient_id,
                    unit_id
                )
            `)
            .eq('name', removedDrinkName)
            .eq('user_id', userId)
            .single();

        if (!drink || !drink.drink_ingredients) {
            return;
        }

        // Para cada ingrediente do drink removido
        for (const drinkIngredient of drink.drink_ingredients) {
            // Verificar se este ingrediente ainda é usado por outros drinks do evento
            const { data: eventDrinks } = await client
                .from('event_drinks')
                .select('drink_name')
                .eq('event_id', eventId);

            if (!eventDrinks || eventDrinks.length === 0) {
                // Se não há mais drinks no evento, remover todos os itens da purchase-list
                await client
                    .from('purchase_list')
                    .delete()
                    .eq('event_id', eventId);
                return;
            }

            // Verificar se o ingrediente ainda é usado por outros drinks
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

        console.log(`Purchase-list limpa após remoção do drink ${removedDrinkName} do evento ${eventId}`);
    } catch (error) {
        console.error('Erro ao limpar purchase-list:', error);
    }
}
