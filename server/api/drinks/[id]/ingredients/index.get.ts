import { getSupabaseClientAndUser } from "~~/server/utils/supabase";
import type { FetchError } from "ofetch";
import type { Tables } from "~~/server/types/database";

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

        if (!drinkId) {
            throw createError({
                statusCode: 400,
                statusMessage: "Bad Request",
                message: "Client ID is required.",
            });
        }

        const { data, error } = await client
            .from("drink_ingredients")
            .select(`
                *,
                ingredients(*, units(name, abbreviation))
            `)
            .eq("drink_id", drinkId)

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: "Failed to fetch drink ingredients",
                message: error.message,
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
