import { getSupabaseClientAndUser } from '~~/server/utils/supabase';
import type { H3Event } from "h3";
import type { FetchError } from "ofetch";
import type { Tables, TablesUpdate } from '~~/server/types/database';

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);
        const ingredientId = event.context.params?.id;
        const body = await readBody<{ ingredient: TablesUpdate<'ingredients'>, quotation: TablesUpdate<'quotations'> }>(event);

        if (!ingredientId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'Ingredient ID is required.',
            });
        }

        const realCostPerBaseUnit = await updateRealCostPerBaseUnit(event, body.ingredient, body.quotation)

        const { data, error } = await client
            .from('ingredients')
            .update({
                current_quotation_id: body.quotation?.id,
                real_cost_per_base_unit: realCostPerBaseUnit
            })
            .eq('id', ingredientId)
            .select(`
                *,
                units (name,abbreviation)
            `);

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to update ingredient',
                message: error.message,
            });
        }

        if (!data || data.length === 0) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Not Found',
                message: `Ingredient with ID ${ingredientId} not found or not accessible for update.`,
            });
        }

        return data[0] as Tables<'ingredients'>;
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});

async function updateRealCostPerBaseUnit(
    event: H3Event,
    ingredient: TablesUpdate<'ingredients'>,
    quotation: TablesUpdate<'quotations'>
): Promise<number> {
    if (!quotation) {
        return 0; // Retorna 0 se não houver cotação
    }

    const { client } = await getSupabaseClientAndUser(event);

    // Busca todas as unidades do banco de dados
    const { data: allUnits, error: unitsError } = await client
        .from('units')
        .select('*');

    if (unitsError || !allUnits) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch units',
            message: unitsError?.message || 'No units data found',
        });
    }

    // Extrai os valores necessários da cotação e do ingrediente
    const purchasePrice = quotation.purchase_price || 0;
    const purchaseQuantity = quotation.purchase_quantity || 0;
    const purchaseUnitId = quotation.purchase_unit_id || 0;
    const ingredientBaseUnitId = ingredient.unit_id || 0;
    const wastagePercentage = ingredient.wastage_percentage || 0;

    const ingredientDetails: IngredientDetails = {
        unit_weight_g: ingredient.unit_weight_g || 0,
        unit_volume_ml: ingredient.unit_volume_ml || 0,
    };

    // Converte a quantidade de compra para a unidade base do ingrediente
    const convertedQuantityToBaseUnit = convertQuantity(
        purchaseQuantity,
        purchaseUnitId,
        ingredientBaseUnitId,
        allUnits,
        ingredientDetails
    );

    if (convertedQuantityToBaseUnit <= 0) {
        return 0; // Retorna 0 se a conversão falhar
    }

    // Calcula o custo por unidade base
    const costPerBaseUnit = calculateCostPerBaseUnit(
        purchasePrice,
        convertedQuantityToBaseUnit,
        wastagePercentage
    );

    return costPerBaseUnit;
}

/**
 * Calcula o custo por unidade base, aplicando o desperdício.
 */
function calculateCostPerBaseUnit(
    purchasePrice: number,
    convertedQuantity: number,
    wastagePercentage: number
): number {
    const costPerBaseUnitRaw = purchasePrice / convertedQuantity;
    const realCostPerBaseUnit = costPerBaseUnitRaw * (1 + wastagePercentage / 100);
    return parseFloat(realCostPerBaseUnit.toFixed(4));
}