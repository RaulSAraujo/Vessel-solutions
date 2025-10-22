import { getSupabaseClientAndUser } from "~~/server/utils/supabase";

export default defineEventHandler(async (event) => {
  try {
    const { client } = await getSupabaseClientAndUser(event);

    // Obter parâmetros de período da query
    const query = getQuery(event);
    const startDate = query.start_date as string;
    const endDate = query.end_date as string;

    // Buscar eventos com dados de lucratividade
    let eventsQuery = client
      .from("events")
      .select(
        `
                id,
                name,
                type,
                event_date,
                status,
                total_cost,
                estimated_cost,
                created_at,
                clients (
                    name
                ),
                event_drinks (
                    quantity,
                    drinks (
                        name,
                        drink_ingredients (
                            quantity,
                            ingredients (
                                cost_per_unit
                            )
                        )
                    )
                )
            `
      )
      .eq("status", "completed")
      .order("event_date", { ascending: false });

    if (startDate && endDate) {
      eventsQuery = eventsQuery
        .gte("event_date", startDate)
        .lte("event_date", endDate);
    }

    const { data: events, error: eventsError } = await eventsQuery;

    if (eventsError) {
      throw createError({
        statusCode: 500,
        statusMessage: "Erro ao buscar eventos",
      });
    }

    // Processar dados para calcular lucratividade
    const profitabilityData =
      events?.map((event) => {
        const totalCost = parseFloat(event.total_cost || "0");
        const estimatedCost = parseFloat(event.estimated_cost || "0");

        // Calcular custo real baseado nos ingredientes
        let actualCost = 0;
        event.event_drinks?.forEach((eventDrink: any) => {
          const drink = eventDrink.drinks;
          if (drink?.drink_ingredients) {
            drink.drink_ingredients.forEach((drinkIngredient: any) => {
              const ingredient = drinkIngredient.ingredients;
              if (ingredient) {
                const quantity =
                  parseFloat(drinkIngredient.quantity || "0") *
                  parseFloat(eventDrink.quantity || "0");
                const costPerUnit = parseFloat(ingredient.cost_per_unit || "0");
                actualCost += quantity * costPerUnit;
              }
            });
          }
        });

        const profit = totalCost - actualCost;
        const profitMargin = totalCost > 0 ? (profit / totalCost) * 100 : 0;
        const costAccuracy =
          actualCost > 0
            ? ((estimatedCost - actualCost) / actualCost) * 100
            : 0;

        return {
          id: event.id,
          name: event.name,
          type: event.type,
          eventDate: event.event_date,
          status: event.status,
          clientName: event.clients?.name || "N/A",
          totalCost,
          estimatedCost,
          actualCost,
          profit,
          profitMargin,
          costAccuracy,
          drinksCount: event.event_drinks?.length || 0,
        };
      }) || [];

    // Ordenar por lucratividade
    profitabilityData.sort((a, b) => b.profit - a.profit);

    // Calcular estatísticas
    const totalEvents = profitabilityData.length;
    const totalRevenue = profitabilityData.reduce(
      (sum, event) => sum + event.totalCost,
      0
    );
    const totalProfit = profitabilityData.reduce(
      (sum, event) => sum + event.profit,
      0
    );
    const averageProfitMargin =
      totalEvents > 0
        ? profitabilityData.reduce(
          (sum, event) => sum + event.profitMargin,
          0
        ) / totalEvents
        : 0;

    const profitableEvents = profitabilityData.filter(
      (event) => event.profit > 0
    ).length;
    const unprofitableEvents = totalEvents - profitableEvents;

    const averageEventValue = totalEvents > 0 ? totalRevenue / totalEvents : 0;
    const averageProfit = totalEvents > 0 ? totalProfit / totalEvents : 0;

    // Análise por tipo de evento
    const typeAnalysis: Record<
      string,
      {
        type: string;
        count: number;
        totalRevenue: number;
        totalProfit: number;
        averageProfitMargin: number;
      }
    > = {};

    profitabilityData.forEach((event) => {
      if (!typeAnalysis[event.type]) {
        typeAnalysis[event.type] = {
          type: event.type,
          count: 0,
          totalRevenue: 0,
          totalProfit: 0,
          averageProfitMargin: 0,
        };
      }

      typeAnalysis[event.type].count += 1;
      typeAnalysis[event.type].totalRevenue += event.totalCost;
      typeAnalysis[event.type].totalProfit += event.profit;
    });

    // Calcular margem média por tipo
    Object.keys(typeAnalysis).forEach((type) => {
      const analysis = typeAnalysis[type];
      analysis.averageProfitMargin =
        analysis.totalRevenue > 0
          ? (analysis.totalProfit / analysis.totalRevenue) * 100
          : 0;
    });

    // Top 5 eventos mais lucrativos
    const topProfitableEvents = profitabilityData.slice(0, 5);

    // Top 5 eventos menos lucrativos
    const leastProfitableEvents = profitabilityData.slice(-5).reverse();

    return {
      data: profitabilityData,
      summary: {
        totalEvents,
        totalRevenue,
        totalProfit,
        averageProfitMargin,
        averageEventValue,
        averageProfit,
        profitableEvents,
        unprofitableEvents,
        profitabilityRate:
          totalEvents > 0 ? (profitableEvents / totalEvents) * 100 : 0,
      },
      analysis: {
        typeAnalysis: Object.values(typeAnalysis),
        topProfitableEvents,
        leastProfitableEvents,
      },
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Erro interno do servidor",
    });
  }
});
