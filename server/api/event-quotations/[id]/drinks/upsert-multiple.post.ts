import { getSupabaseClientAndUser } from '~~/server/utils/supabase';
import type { FetchError } from "ofetch";
import type { Tables, TablesInsert } from '~~/server/types/database';

type EventQuotationDrink = Tables<"event_quotation_drinks">;

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);
        const id = getRouterParam(event, 'id');
        const body = await readBody<TablesInsert<'event_quotation_drinks'>[]>(event);

        if (!id) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'ID is required',
            });
        }

        const drinksData = body.map((drink) => ({
            id: drink.id, // Incluir ID se disponível para permitir UPDATE
            event_quotation_id: id,
            drink_percentage: drink.drink_percentage,
            drink_name: drink.drink_name,
            drink_category_name: drink.drink_category_name,
            drink_description: drink.drink_description,
            drink_image_url: drink.drink_image_url,
            drink_calculated_cost: drink.drink_calculated_cost,
            drink_selling_price: drink.drink_selling_price,
            drink_profit_margin_percentage: drink.drink_profit_margin_percentage,
        }));

        const { data, error: upsertError } = await client.rpc('upsert_multiple_event_quotation_drinks', {
            _event_quotation_drinks: drinksData
        });

        if (upsertError) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to upsert event quotation drinks',
                message: upsertError.message,
            });
        }

        return data as EventQuotationDrink[];
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});
