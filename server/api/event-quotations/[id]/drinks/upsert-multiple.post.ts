import { getSupabaseClientAndUser } from '~~/server/utils/supabase';
import type { FetchError } from "ofetch";

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);
        const id = getRouterParam(event, 'id');
        const body = await readBody(event);

        if (!id) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'ID is required',
            });
        }

        // Deletar drinks existentes
        const { error: deleteError } = await client
            .from('event_quotation_drinks')
            .delete()
            .eq('event_quotation_id', id);

        if (deleteError) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to delete existing event quotation drinks',
                message: deleteError.message,
            });
        }

        // Inserir novos drinks
        const drinksData = body.map((drink: any) => ({
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

        const { data, error: insertError } = await client
            .from('event_quotation_drinks')
            .insert(drinksData)
            .select();

        if (insertError) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to insert event quotation drinks',
                message: insertError.message,
            });
        }

        return data;
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});
