/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Tables } from "~~/server/types/database";

// Tipos para os dados dos drinks do evento
interface EventDrink {
    id: string;
    event_id: string;
    drink_name: string | null;
    drink_percentage: number;
}


/**
 * Gera itens da purchase-list automaticamente para um evento
 * @param client - Cliente Supabase
 * @param eventId - ID do evento
 * @param eventData - Dados do evento
 */
export async function generatePurchaseListItems(
    client: SupabaseClient,
    eventId: string,
    eventData: Tables<"events">
) {
    try {
        // Buscar todas as unidades do sistema
        const { data: allUnits, error: unitsError } = await client
            .from('units')
            .select('*');

        if (unitsError || !allUnits) {
            console.error('Erro ao buscar unidades:', unitsError);
            return;
        }

        // Obter o total de drinks estimado para o evento
        let totalDrinks = eventData.estimated_total_drinks;

        // Se não há total estimado, usar um valor padrão baseado no número de convidados
        if (!totalDrinks || totalDrinks === 0) {
            totalDrinks = eventData.guest_count * 3.0; // 3 drinks por convidado como padrão
        }

        // Buscar todos os drinks do evento
        const { data: eventDrinks, error: eventDrinksError } = await client
            .from('event_drinks')
            .select('*')
            .eq('event_id', eventId);

        if (eventDrinksError) {
            console.error('Erro ao buscar drinks do evento:', eventDrinksError);
            return;
        }

        if (!eventDrinks || eventDrinks.length === 0) {
            return;
        }

        // Para cada drink do evento, buscar seus ingredientes
        for (const eventDrink of eventDrinks) {
            await processEventDrink(client, eventDrink, eventData, allUnits as Units[], totalDrinks);
        }

    } catch (error) {
        console.error('Erro ao gerar purchase-list automaticamente:', error);
    }
}

/**
 * Gera itens da purchase-list para um novo drink adicionado a um evento
 * @param client - Cliente Supabase
 * @param eventId - ID do evento
 * @param eventDrink - Dados do drink do evento
 */
export async function generatePurchaseListForNewDrink(
    client: SupabaseClient,
    eventId: string,
    eventDrink: EventDrink,
) {
    try {
        // Buscar todas as unidades do sistema
        const { data: allUnits, error: unitsError } = await client
            .from('units')
            .select('*');

        if (unitsError || !allUnits) {
            console.error('Erro ao buscar unidades:', unitsError);
            return;
        }

        // Buscar dados completos do evento
        const { data: eventData } = await client
            .from('events')
            .select('*')
            .eq('id', eventId)
            .single();

        if (!eventData) {
            return;
        }

        // Obter o total de drinks estimado para o evento
        let totalDrinks = eventData.estimated_total_drinks;

        // Se não há total estimado, usar um valor padrão baseado no número de convidados
        if (!totalDrinks || totalDrinks === 0) {
            totalDrinks = eventData.guest_count * 3.0; // 3 drinks por convidado como padrão
        }

        await processEventDrink(client, eventDrink, eventData, allUnits as Units[], totalDrinks);

    } catch (error) {
        console.error('Erro ao gerar purchase-list para novo drink:', error);
    }
}

/**
 * Recalcula todos os itens da purchase-list para um evento
 * Usado quando há mudanças na quantidade estimada de drinks ou porcentagens
 * @param client - Cliente Supabase
 * @param eventId - ID do evento
 */
export async function recalculatePurchaseListForEvent(
    client: SupabaseClient,
    eventId: string
) {
    try {
        // Buscar dados do evento
        const { data: eventData } = await client
            .from('events')
            .select('*')
            .eq('id', eventId)
            .single();

        if (!eventData) {
            console.error(`Evento ${eventId} não encontrado`);
            return;
        }

        // Limpar purchase-list existente para este evento
        await client
            .from('purchase_list')
            .delete()
            .eq('event_id', eventId);

        // Regenerar purchase-list com os novos dados
        await generatePurchaseListItems(client, eventId, eventData);

    } catch (error) {
        console.error('Erro ao recalcular purchase-list:', error);
    }
}

/**
 * Remove itens da purchase-list quando um drink é deletado do evento
 * @param client - Cliente Supabase
 * @param eventId - ID do evento
 * @param removedDrinkName - Nome do drink removido
 * @param userId - ID do usuário
 */
export async function cleanupPurchaseListAfterDrinkRemoval(
    client: SupabaseClient,
    eventId: string,
    removedDrinkName: string,
    userId: string
) {
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

        // Verificar se ainda há outros drinks no evento
        const { data: remainingEventDrinks } = await client
            .from('event_drinks')
            .select('drink_name')
            .eq('event_id', eventId);

        if (!remainingEventDrinks || remainingEventDrinks.length === 0) {
            // Se não há mais drinks no evento, remover todos os itens da purchase-list
            await client
                .from('purchase_list')
                .delete()
                .eq('event_id', eventId);

            return;
        }

        // Para cada ingrediente do drink removido
        for (const drinkIngredient of drink.drink_ingredients) {
            // Verificar se este ingrediente ainda é usado por outros drinks do evento
            let ingredientStillUsed = false;

            for (const eventDrink of remainingEventDrinks) {
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

    } catch (error) {
        console.error('Erro ao limpar purchase-list após remoção de drink:', error);
    }
}

/**
 * Processa um drink do evento e gera os itens da purchase-list
 * @param client - Cliente Supabase
 * @param eventDrink - Dados do drink do evento
 * @param eventData - Dados do evento
 * @param allUnits - Todas as unidades do sistema
 * @param totalDrinks - Total de drinks estimado para o evento
 */
async function processEventDrink(
    client: SupabaseClient,
    eventDrink: EventDrink,
    eventData: Tables<"events">,
    allUnits: Units[],
    totalDrinks: number
) {
    // Buscar o drink original para obter os ingredientes com quotation completa
    const { data: drink, error: drinkError } = await client
        .from('drinks')
        .select(`
            id,
            name,
            drink_ingredients (
                quantity,
                unit_id,
                ingredient_id,
                ingredients!inner(
                    id,
                    name,
                    unit_id,
                    unit_weight_g,
                    unit_volume_ml,
                    current_quotation_id,
                    units (name, abbreviation),
                    quotation:quotations!current_quotation_id (
                        id,
                        purchase_price,
                        purchase_quantity,
                        purchase_unit_id,
                        supplier_id,
                        quotation_date
                    )
                )
            )
        `)
        .eq('name', eventDrink.drink_name)
        .eq('user_id', eventData.user_id)
        .single();

    if (drinkError || !drink) {
        return;
    }

    // Verificar se drink_ingredients existe e é um array
    if (!drink.drink_ingredients || !Array.isArray(drink.drink_ingredients)) {
        console.warn(`Nenhum ingrediente encontrado para drink ${drink.name}`);
        return;
    }

    // Para cada ingrediente do drink
    for (const drinkIngredient of drink.drink_ingredients) {
        // A query já retorna o ingrediente com quotation completa
        if (drinkIngredient.ingredients) {
            await processIngredient(
                client,
                eventDrink,
                eventData,
                drinkIngredient,
                drinkIngredient.ingredients,
                allUnits,
                totalDrinks
            );
        } else {
            console.warn(`Ingrediente não encontrado para drink ${eventDrink.drink_name}`);
        }
    }
}

/**
 * Processa um ingrediente e adiciona/atualiza na purchase-list
 * @param client - Cliente Supabase
 * @param eventDrink - Dados do drink do evento
 * @param eventData - Dados do evento
 * @param drinkIngredient - Dados do ingrediente do drink (com dados aninhados da query)
 * @param ingredient - Dados do ingrediente com quotation completa
 * @param allUnits - Todas as unidades do sistema
 * @param totalDrinks - Total de drinks estimado para o evento
 */
async function processIngredient(
    client: SupabaseClient,
    eventDrink: EventDrink,
    eventData: Tables<"events">,
    drinkIngredient: any, // Tipo flexível para incluir dados aninhados da query
    ingredient: any, // Tipo mais flexível para incluir quotation
    allUnits: Units[],
    totalDrinks: number
) {
    // Calcular quantidade necessária do ingrediente na unidade base (da receita)
    const ingredientQuantityInBaseUnit = (eventDrink.drink_percentage / 100.0) * totalDrinks * drinkIngredient.quantity;

    // Usar dados da quotation se disponível, senão usar unidade base
    let purchaseUnitId = drinkIngredient.unit_id; // Unidade base por padrão
    let purchaseQuantity = ingredientQuantityInBaseUnit;

    // Se o ingrediente tem uma quotation ativa, usar seus dados
    if (ingredient.quotation && ingredient.quotation.purchase_unit_id) {
        purchaseUnitId = ingredient.quotation.purchase_unit_id;

        // Converter da unidade base (receita) para a unidade de compra (cotação)
        try {
            const ingredientDetails: IngredientDetails = {
                unit_weight_g: ingredient.unit_weight_g,
                unit_volume_ml: ingredient.unit_volume_ml,
            };

            if (!drinkIngredient.unit_id || !purchaseUnitId) throw new Error('Unidades inválidas');

            purchaseQuantity = convertQuantity(
                ingredientQuantityInBaseUnit,
                drinkIngredient.unit_id, // Unidade base da receita
                purchaseUnitId, // Unidade de compra da cotação
                allUnits,
                ingredientDetails
            );
        } catch (conversionError) {
            console.warn(`Erro na conversão de unidades para ingrediente ${ingredient.name}:`, conversionError);
            // Em caso de erro, usar a unidade base
            purchaseUnitId = drinkIngredient.unit_id;
            purchaseQuantity = ingredientQuantityInBaseUnit;
        }
    }

    // Calcular custo estimado
    let estimatedCost = null;
    if (ingredient.quotation && ingredient.quotation.purchase_price && ingredient.quotation.purchase_quantity) {
        // Calcular custo por unidade de compra
        const costPerPurchaseUnit = ingredient.quotation.purchase_price / ingredient.quotation.purchase_quantity;
        estimatedCost = purchaseQuantity * costPerPurchaseUnit;
    } else if (ingredient.real_cost_per_base_unit) {
        // Se não há cotação, usar o custo real por unidade base
        // Converter da unidade de compra para a unidade base para calcular o custo
        try {
            const ingredientDetails: IngredientDetails = {
                unit_weight_g: ingredient.unit_weight_g,
                unit_volume_ml: ingredient.unit_volume_ml,
            };

            if (purchaseUnitId && drinkIngredient.unit_id) {
                const quantityInBaseUnit = convertQuantity(
                    purchaseQuantity,
                    purchaseUnitId, // Unidade de compra
                    drinkIngredient.unit_id, // Unidade base
                    allUnits,
                    ingredientDetails
                );
                estimatedCost = quantityInBaseUnit * ingredient.real_cost_per_base_unit;
            }
        } catch (conversionError) {
            console.warn(`Erro na conversão para calcular custo do ingrediente ${ingredient.name}:`, conversionError);
            // Em caso de erro, usar quantidade direta (assumindo mesma unidade)
            estimatedCost = purchaseQuantity * ingredient.real_cost_per_base_unit;
        }
    }

    // Verificar se já existe um item na purchase-list para este ingrediente na mesma unidade
    const { data: existingItem } = await client
        .from('purchase_list')
        .select('id, quantity_needed, estimated_cost')
        .eq('event_id', eventData.id)
        .eq('ingredient_id', drinkIngredient.ingredient_id)
        .eq('unit_id', purchaseUnitId)
        .single();

    const eventNotes = `Gerado automaticamente para o evento: ${eventData.location} (${new Date(eventData.start_time).toLocaleDateString('pt-BR')})`;

    if (existingItem) {
        // Atualizar quantidade existente e custo estimado
        const newEstimatedCost = existingItem.estimated_cost ?
            (existingItem.estimated_cost + (estimatedCost || 0)) :
            estimatedCost;

        await client
            .from('purchase_list')
            .update({
                quantity_needed: existingItem.quantity_needed + purchaseQuantity,
                estimated_cost: newEstimatedCost,
                notes: eventNotes
            })
            .eq('id', existingItem.id);
    } else {
        // Inserir novo item na purchase-list
        await client
            .from('purchase_list')
            .insert({
                event_id: eventData.id,
                ingredient_id: drinkIngredient.ingredient_id,
                quantity_needed: purchaseQuantity,
                unit_id: purchaseUnitId,
                status: 'pending',
                notes: eventNotes,
                estimated_cost: estimatedCost,
                user_id: eventData.user_id,
            });
    }
}
