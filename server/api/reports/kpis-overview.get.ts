import { getSupabaseClientAndUser } from "~~/server/utils/supabase";
import type { FetchError } from "ofetch";

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);

        // Obter parâmetros de período da query
        const query = getQuery(event);
        const startDate = query.start_date as string;
        const endDate = query.end_date as string;

        // Buscar dados de clientes
        const { count: totalClients, error: clientsError } = await client
            .from("clients")
            .select("*", { count: "exact", head: true });

        // Buscar dados de eventos com filtro de período
        let eventsQuery = client
            .from("events")
            .select("total_cost, total_revenue, created_at", { count: "exact" })
            .eq("status", "completed");

        if (startDate && endDate) {
            eventsQuery = eventsQuery
                .gte("created_at", startDate)
                .lte("created_at", endDate);
        }

        const { data: events, error: eventsError, count: totalEvents } = await eventsQuery;

        // Buscar dados de bebidas
        const { count: totalDrinks, error: drinksError } = await client
            .from("drinks")
            .select("*", { count: "exact", head: true });

        // Calcular crescimento mensal
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

        const currentMonthEvents = events?.filter(event => {
            const eventDate = new Date(event.created_at || '');
            return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
        }).length || 0;

        const lastMonthEvents = events?.filter(event => {
            const eventDate = new Date(event.created_at || '');
            return eventDate.getMonth() === lastMonth && eventDate.getFullYear() === lastMonthYear;
        }).length || 0;

        const monthlyGrowth = lastMonthEvents > 0
            ? ((currentMonthEvents - lastMonthEvents) / lastMonthEvents) * 100
            : 0;

        if (clientsError || eventsError || drinksError) {
            throw createError({
                statusCode: 500,
                statusMessage: "Failed to fetch data",
                message: clientsError?.message || eventsError?.message || drinksError?.message,
            });
        }

        return {
            data: {
                clients: {
                    count: totalClients || 0
                },
                events: {
                    count: totalEvents || 0,
                    total_cost: events?.reduce((acc, event) => acc + (event?.total_cost || 0), 0) || 0,
                    total_revenue: events?.reduce((acc, event) => acc + (event?.total_revenue || 0), 0) || 0
                },
                drinks: {
                    count: totalDrinks || 0
                },
                monthly_growth: Math.round(monthlyGrowth * 100) / 100
            },
        };
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});
