import type { FetchError } from "ofetch";
import { convertQuantity } from "../../../shared/utils/unitConverter";
import type { Units, IngredientDetails } from "../../../shared/types/units";

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);

        const query = getQuery(event);
        const eventId = query.event_id as string;

        let supabaseQuery = client
            .from("purchase_list")
            .select(`
                id,
                status,
                quantity_needed,
                unit_id,
                ingredients!inner (
                    id,
                    name,
                    unit_id,
                    current_quotation_id,
                    unit_weight_g,
                    unit_volume_ml,
                    real_cost_per_base_unit
                ),
                units!inner (
                    id,
                    name,
                    abbreviation
                )
            `);

        if (eventId) {
            supabaseQuery = supabaseQuery.eq('event_id', eventId);
        }

        const { data, error } = await supabaseQuery;

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to fetch purchase list summary',
                message: error.message,
            });
        }

        const summary = {
            total_items: data?.length || 0,
            pending_items: data?.filter(item => item.status === 'pending').length || 0,
            purchased_items: data?.filter(item => item.status === 'purchased').length || 0,
            cancelled_items: data?.filter(item => item.status === 'cancelled').length || 0,
            total_estimated_cost: 0,
        };

        // Calcular custo total estimado
        if (data) {
            // Buscar todas as unidades do sistema
            const { data: allUnits } = await client
                .from('units')
                .select('*');

            summary.total_estimated_cost = data.reduce((total, item) => {
                const ingredient = item.ingredients;
                let costPerUnit = 0;

                // Se o ingrediente tem uma cotação ativa, calcular o custo baseado na cotação
                if (ingredient.current_quotation_id) {
                    // Buscar a cotação
                    const quotation = data.find(d => d.ingredients.current_quotation_id === ingredient.current_quotation_id);
                    if (quotation) {
                        // Calcular custo por unidade base usando a cotação
                        try {
                            const ingredientDetails: IngredientDetails = {
                                unit_weight_g: ingredient.unit_weight_g,
                                unit_volume_ml: ingredient.unit_volume_ml,
                            };

                            // Converter da unidade de compra para a unidade base
                            const convertedQuantity = convertQuantity(
                                1, // 1 unidade de compra
                                item.unit_id, // Unidade de compra (da purchase-list)
                                ingredient.unit_id, // Unidade base do ingrediente
                                allUnits as Units[],
                                ingredientDetails
                            );

                            // Calcular custo por unidade base
                            costPerUnit = quotation.ingredients.real_cost_per_base_unit || 0;
                        } catch (conversionError) {
                            console.warn(`Erro na conversão para cálculo de custo do ingrediente ${ingredient.name}:`, conversionError);
                            costPerUnit = ingredient.real_cost_per_base_unit || 0;
                        }
                    }
                } else {
                    // Usar o custo real por unidade base
                    costPerUnit = ingredient.real_cost_per_base_unit || 0;
                }

                return total + (item.quantity_needed * costPerUnit);
            }, 0);
        }

        return summary;
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});
