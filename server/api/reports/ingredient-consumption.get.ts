import { getSupabaseClientAndUser } from "~~/server/utils/supabase";

interface DrinkIngredient {
  quantity: number;
  ingredients: {
    name: string;
    real_cost_per_base_unit: number | null;
    units: {
      name: string;
      abbreviation: string;
    } | null;
  };
}

export default defineEventHandler(async (event) => {
  try {
    const { client } = await getSupabaseClientAndUser(event);

    // Obter parâmetros de período da query
    const query = getQuery(event);
    const startDate = query.start_date as string;
    const endDate = query.end_date as string;

    // Buscar eventos concluídos
    let eventsQuery = client
      .from("events")
      .select(
        `
          id,
          location,
          start_time,
          total_cost,
          estimated_total_drinks,
          event_drinks (
              drink_percentage,
              drink_name,
              drink_calculated_cost
          )
        `
      )
      .eq("status", "Concluído");

    if (startDate && endDate) {
      eventsQuery = eventsQuery
        .gte("start_time", startDate)
        .lte("start_time", endDate);
    }

    const { data: events, error: eventsError } = await eventsQuery;

    if (eventsError) {
      throw createError({
        statusCode: 500,
        statusMessage: "Erro ao buscar eventos",
      });
    }

    // Buscar todos os drinks com seus ingredientes
    const { data: drinks, error: drinksError } = await client
      .from("drinks")
      .select(
        `
          id,
          name,
          drink_ingredients (
            quantity,
            ingredients (
              id,
              name,
              real_cost_per_base_unit,
              units (
                name,
                abbreviation
              )
            )
          )
        `
      );

    if (drinksError) {
      throw createError({
        statusCode: 500,
        statusMessage: "Erro ao buscar drinks",
      });
    }

    // Criar mapa de drinks por nome para correlação
    const drinksMap = new Map();
    drinks?.forEach((drink) => {
      drinksMap.set(drink.name, drink);
    });

    // Processar dados para calcular consumo de ingredientes
    const ingredientConsumption: Record<
      string,
      {
        name: string;
        unit: string;
        totalQuantity: number;
        totalCost: number;
        eventsUsed: number;
        averageCostPerUnit: number;
      }
    > = {};

    events?.forEach((event) => {
      event.event_drinks?.forEach((eventDrink) => {
        const drink = drinksMap.get(eventDrink.drink_name);
        if (drink?.drink_ingredients) {
          // Calcular quantidade total do drink no evento
          const totalDrinkQuantity = ((event.estimated_total_drinks || 0) * eventDrink.drink_percentage) / 100;

          drink.drink_ingredients.forEach((drinkIngredient: DrinkIngredient) => {
            const ingredient = drinkIngredient.ingredients;
            if (ingredient) {
              const key = ingredient.name;
              const quantity = parseFloat(String(drinkIngredient.quantity || "0")) * totalDrinkQuantity;
              const costPerUnit = parseFloat(String(ingredient.real_cost_per_base_unit || "0"));
              const totalCost = quantity * costPerUnit;

              if (!ingredientConsumption[key]) {
                ingredientConsumption[key] = {
                  name: ingredient.name,
                  unit: ingredient.units?.abbreviation || ingredient.units?.name || "un",
                  totalQuantity: 0,
                  totalCost: 0,
                  eventsUsed: 0,
                  averageCostPerUnit: costPerUnit,
                };
              }

              ingredientConsumption[key].totalQuantity += quantity;
              ingredientConsumption[key].totalCost += totalCost;
              ingredientConsumption[key].eventsUsed += 1;
            }
          });
        }
      });
    });

    // Converter para array e ordenar por custo total
    const consumptionData = Object.values(ingredientConsumption).sort(
      (a, b) => b.totalCost - a.totalCost
    );

    // Calcular totais
    const totalCost = consumptionData.reduce(
      (sum, item) => sum + item.totalCost,
      0
    );
    const totalIngredients = consumptionData.length;
    const totalEvents = events?.length || 0;

    return {
      data: consumptionData,
      summary: {
        totalCost,
        totalIngredients,
        totalEvents,
        averageCostPerEvent: totalEvents > 0 ? totalCost / totalEvents : 0,
      },
    };
  } catch (error: unknown) {
    const err = error as { statusCode?: number; statusMessage?: string };
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || "Erro interno do servidor",
    });
  }
});
