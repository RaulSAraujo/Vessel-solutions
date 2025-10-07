import { getSupabaseClientAndUser } from "~~/server/utils/supabase";

import type { FetchError } from "ofetch";
import type { Tables, TablesInsert } from "~~/server/types/database";

export default defineEventHandler(async (event) => {
  try {
    const { client, user } = await getSupabaseClientAndUser(event);
    const body = await readBody<TablesInsert<"drinks"> & {
      drink_ingredients: {
        ingredients: {
          id: string;
        }
        quantity: number;
      }[]
    }>(event);

    // Validação básica
    if (!body.name || !body.type) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
        message: "Drink name is required.",
      });
    }

    if (!body.drink_ingredients || body.drink_ingredients.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
        message: "At least one ingredient is required.",
      });
    }

    // Inserir o drink
    const { data: drinkData, error: drinkError } = await client
      .from("drinks")
      .insert({
        name: body.name,
        type: body.type,
        user_id: user.id,
      })
      .select()
      .single(); // Retorna apenas o primeiro registro criado

    if (drinkError) {
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to create drink",
        message: drinkError.message,
      });
    }

    const ingredientsToInsert = body.drink_ingredients.map((ingredient) => ({
      drink_id: drinkData.id,
      ingredient_id: ingredient.ingredients.id,
      quantity: ingredient.quantity,
    }));

    const { error: ingredientsError } = await client
      .from("drink_ingredients")
      .insert(ingredientsToInsert);

    if (ingredientsError) {
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to add ingredients",
        message: ingredientsError.message,
      });
    }

    // Retornar o drink criado com os ingredientes
    const { data: fullDrink, error: fetchError } = await client
      .from("drinks")
      .select(`
        *,
        drink_ingredients (
          quantity,
          ingredients (
            name,
            units (
              name,
              abbreviation
            )
          )
        )
      `)
      .eq("id", drinkData.id)
      .single();

    if (fetchError) {
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to fetch drink",
        message: fetchError.message,
      });
    }

    return fullDrink as Tables<"drinks">;
  } catch (error: unknown) {
    const err = error as FetchError;

    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || "Internal Server Error",
      message: err.message,
    });
  }
});