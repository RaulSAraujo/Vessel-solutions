import { getSupabaseClientAndUser } from '~~/server/utils/supabase';
import type { FetchError } from "ofetch";
import type { Tables, TablesInsert } from '~~/server/types/database';

type DrinkIngredientWithRelation = Tables<"drink_ingredients"> & {
    ingredients: Tables<"ingredients"> & {
        units: {
            name: string;
            abbreviation: string;
        };
    };
}

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);
        const drinkId = event.context.params?.id;
        const body = await readBody<TablesInsert<'drink_ingredients'>[]>(event);

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

        const ingredients = body.map((ingredient) => ({
            drink_id: drinkId,
            ingredient_id: ingredient.ingredient_id,
            quantity: ingredient.quantity,
            unit_id: ingredient.unit_id,
        }));

        const { data, error: ingredientsError } = await client.rpc('upsert_multiple_drink_ingredients', {
            p_drink_ingredients_array: ingredients
        })


        if (ingredientsError) {
            throw createError({
                statusCode: 500,
                statusMessage: "Failed to add ingredients",
                message: ingredientsError.message,
            });
        }

        return data as DrinkIngredientWithRelation[];
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});