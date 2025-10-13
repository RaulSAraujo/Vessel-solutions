import { getSupabaseClientAndUser } from "~~/server/utils/supabase";

import type { FetchError } from "ofetch";
import type { Tables, TablesInsert } from "~~/server/types/database";

export default defineEventHandler(async (event) => {
  try {
    const { client, user } = await getSupabaseClientAndUser(event);
    const body = await readBody<TablesInsert<"drinks">>(event);

    // Validação básica
    if (!body.name ||
      !body.calculated_cost ||
      !body.selling_price ||
      !body.profit_margin_percentage ||
      !body.category_id) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
        message: "Drink name is required.",
      });
    }

    // Inserir o drink
    const { data, error } = await client
      .from("drinks")
      .insert({
        ...body,
        user_id: user.id,
      })
      .select(`
        *,
        drink_categories (name)
      `)

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to create drink",
        message: error.message,
      });
    }

    return data[0] as Tables<"drinks">;
  } catch (error: unknown) {
    const err = error as FetchError;

    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || "Internal Server Error",
      message: err.message,
    });
  }
});