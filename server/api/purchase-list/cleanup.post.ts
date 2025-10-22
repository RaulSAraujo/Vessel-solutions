import type { FetchError } from "ofetch";

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);
        const body = await readBody<{ event_id?: string }>(event);

        let query = client
            .from('purchase_list')
            .select(`
                id,
                event_id,
                events!inner (id)
            `);

        if (body.event_id) {
            query = query.eq('event_id', body.event_id);
        }

        const { data: purchaseListItems, error: selectError } = await query;

        if (selectError) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to fetch purchase list items',
                message: selectError.message,
            });
        }

        if (!purchaseListItems || purchaseListItems.length === 0) {
            return { message: 'No items to clean up', cleaned: 0 };
        }

        // Para cada item da purchase-list, verificar se o evento ainda tem os drinks correspondentes
        const itemsToDelete: string[] = [];

        for (const item of purchaseListItems) {
            // Buscar o ingrediente do item
            const { data: ingredient } = await client
                .from('purchase_list')
                .select(`
                    ingredient_id,
                    events!inner (
                        event_drinks (
                            drink_name
                        )
                    )
                `)
                .eq('id', item.id)
                .single();

            if (!ingredient) continue;

            // Verificar se algum drink do evento ainda usa este ingrediente
            const { data: eventDrinks } = await client
                .from('event_drinks')
                .select('drink_name')
                .eq('event_id', item.event_id);

            if (!eventDrinks || eventDrinks.length === 0) {
                // Se não há drinks no evento, remover todos os itens
                itemsToDelete.push(item.id);
                continue;
            }

            // Verificar se algum drink ainda usa este ingrediente
            let ingredientStillUsed = false;

            for (const eventDrink of eventDrinks) {
                const { data: drink } = await client
                    .from('drinks')
                    .select(`
                        drink_ingredients!inner (
                            ingredient_id
                        )
                    `)
                    .eq('name', eventDrink.drink_name)
                    .eq('user_id', ingredient.events.user_id)
                    .single();

                if (drink && drink.drink_ingredients.some((di: any) => di.ingredient_id === ingredient.ingredient_id)) {
                    ingredientStillUsed = true;
                    break;
                }
            }

            if (!ingredientStillUsed) {
                itemsToDelete.push(item.id);
            }
        }

        // Deletar itens órfãos
        if (itemsToDelete.length > 0) {
            const { error: deleteError } = await client
                .from('purchase_list')
                .delete()
                .in('id', itemsToDelete);

            if (deleteError) {
                throw createError({
                    statusCode: 500,
                    statusMessage: 'Failed to delete orphaned items',
                    message: deleteError.message,
                });
            }
        }

        return {
            message: 'Cleanup completed successfully',
            cleaned: itemsToDelete.length
        };
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});
