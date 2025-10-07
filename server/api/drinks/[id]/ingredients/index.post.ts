import { getSupabaseClientAndUser } from '~~/server/utils/supabase';
import type { FetchError } from "ofetch";
import type { Tables } from '~~/server/types/database';

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);
        const drinkId = event.context.params?.id;
        const body = await readBody<{
            quantity: number;
            ingredients: Tables<'ingredients'>
        }[]>(event);

        if (!drinkId) {
            throw createError({
                statusCode: 400,
                statusMessage: "Bad Request",
                message: "Drink ID is required.",
            });
        }

        if (!body || body.length === 0) {
            throw createError({
                statusCode: 400,
                statusMessage: "Bad Request",
                message: "At least one ingredient is required.",
            });
        }

        const ingredientsToInsert = body.map((ingredient) => ({
            drink_id: drinkId,
            ingredient_id: ingredient.ingredients.id,
            quantity: ingredient.quantity,
        }));

        const { data, error: ingredientsError } = await client
            .from("drink_ingredients")
            .insert(ingredientsToInsert)
            .select();

        if (ingredientsError) {
            throw createError({
                statusCode: 500,
                statusMessage: "Failed to add ingredients",
                message: ingredientsError.message,
            });
        }

        return data as Tables<"drink_ingredients">[];
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});