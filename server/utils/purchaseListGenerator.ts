import type { SupabaseClient } from "@supabase/supabase-js";
import type { Tables } from "~~/server/types/database";
import { convertQuantity } from "../../shared/utils/unitConverter";
import type { Units, IngredientDetails } from "../../shared/types/units";


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
            console.log('Nenhum drink encontrado para o evento');
            return;
        }

        // Para cada drink do evento, buscar seus ingredientes
        for (const eventDrink of eventDrinks) {
            await processEventDrink(client, eventDrink, eventData, allUnits as Units[], totalDrinks);
        }

        console.log(`Purchase-list gerada automaticamente para o evento ${eventId}`);
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

        console.log(`Purchase-list atualizada para o novo drink ${eventDrink.drink_name} no evento ${eventId}`);
    } catch (error) {
        console.error('Erro ao gerar purchase-list para novo drink:', error);
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
    // Buscar o drink original para obter os ingredientes
    const { data: drink, error: drinkError } = await client
        .from('drinks')
        .select(`
            id,
            name,
            drink_ingredients (
                ingredient_id,
                quantity,
                unit_id,
                ingredients!inner (
                    id,
                    name,
                    unit_id,
                    current_quotation_id,
                    unit_weight_g,
                    unit_volume_ml,
                    units (name, abbreviation)
                )
            )
        `)
        .eq('name', eventDrink.drink_name)
        .eq('user_id', eventData.user_id)
        .single();

    if (drinkError || !drink) {
        console.log(`Drink não encontrado: ${eventDrink.drink_name}`);
        return;
    }

    // Verificar se drink_ingredients existe e é um array
    if (!drink.drink_ingredients || !Array.isArray(drink.drink_ingredients)) {
        console.warn(`Nenhum ingrediente encontrado para drink ${drink.name}`);
        return;
    }

    // Para cada ingrediente do drink
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const drinkIngredient of drink.drink_ingredients as any[]) {
        // Verificar se ingredients existe e é um array
        if (drinkIngredient.ingredients && Array.isArray(drinkIngredient.ingredients)) {
            // Para cada ingrediente relacionado (pode haver múltiplos)
            for (const ingredient of drinkIngredient.ingredients) {
                await processIngredient(
                    client,
                    eventDrink,
                    eventData,
                    drinkIngredient,
                    ingredient,
                    allUnits,
                    totalDrinks
                );
            }
        } else {
            // Se não há ingredientes aninhados, pode ser que a query não trouxe os dados relacionados
            // Vamos buscar o ingrediente diretamente usando o ingredient_id
            if (drinkIngredient.ingredient_id) {
                const { data: ingredient } = await client
                    .from('ingredients')
                    .select(`
                        id,
                        name,
                        unit_id,
                        current_quotation_id,
                        unit_weight_g,
                        unit_volume_ml,
                        units (name, abbreviation)
                    `)
                    .eq('id', drinkIngredient.ingredient_id)
                    .single() as { data: Tables<"ingredients"> | null };

                if (ingredient) {
                    await processIngredient(
                        client,
                        eventDrink,
                        eventData,
                        drinkIngredient,
                        ingredient,
                        allUnits,
                        totalDrinks
                    );
                }
            } else {
                console.warn(`Ingrediente não encontrado para drink ${eventDrink.drink_name}`);
            }
        }
    }
}

/**
 * Processa um ingrediente e adiciona/atualiza na purchase-list
 * @param client - Cliente Supabase
 * @param eventDrink - Dados do drink do evento
 * @param eventData - Dados do evento
 * @param drinkIngredient - Dados do ingrediente do drink
 * @param ingredient - Dados do ingrediente
 * @param allUnits - Todas as unidades do sistema
 * @param totalDrinks - Total de drinks estimado para o evento
 */
async function processIngredient(
    client: SupabaseClient,
    eventDrink: EventDrink,
    eventData: Tables<"events">,
    drinkIngredient: Tables<"drink_ingredients">,
    ingredient: Tables<"ingredients">,
    allUnits: Units[],
    totalDrinks: number
) {
    // Calcular quantidade necessária do ingrediente na unidade base (da receita)
    const ingredientQuantityInBaseUnit = (eventDrink.drink_percentage / 100.0) * totalDrinks * drinkIngredient.quantity;

    // Determinar a unidade de compra
    let purchaseUnitId = drinkIngredient.unit_id; // Unidade base por padrão
    let purchaseQuantity = ingredientQuantityInBaseUnit;

    // Se o ingrediente tem uma cotação ativa, usar a unidade da cotação
    if (ingredient.current_quotation_id) {
        const { data: quotation } = await client
            .from('quotations')
            .select('purchase_unit_id')
            .eq('id', ingredient.current_quotation_id)
            .single();

        if (quotation && quotation.purchase_unit_id) {
            purchaseUnitId = quotation.purchase_unit_id;

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
    }

    // Verificar se já existe um item na purchase-list para este ingrediente na mesma unidade
    const { data: existingItem } = await client
        .from('purchase_list')
        .select('id, quantity_needed')
        .eq('event_id', eventData.id)
        .eq('ingredient_id', drinkIngredient.ingredient_id)
        .eq('unit_id', purchaseUnitId)
        .single();

    if (existingItem) {
        // Atualizar quantidade existente
        await client
            .from('purchase_list')
            .update({
                quantity_needed: existingItem.quantity_needed + purchaseQuantity,
                notes: `Gerado automaticamente para o evento: ${eventData.location} (${new Date(eventData.start_time).toLocaleDateString('pt-BR')})`
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
                notes: `Gerado automaticamente para o evento: ${eventData.location} (${new Date(eventData.start_time).toLocaleDateString('pt-BR')})`
            });
    }
}
