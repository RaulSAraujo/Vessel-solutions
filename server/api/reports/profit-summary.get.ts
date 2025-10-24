// api/reports/profit-summary.ts
import { getSupabaseClientAndUser } from '../../utils/supabase';
import type { FetchError } from 'ofetch';

export default defineEventHandler(async (event) => {
    try {
        const { client, user } = await getSupabaseClientAndUser(event);

        // Verificar autenticação primeiro
        if (!user) {
            throw createError({
                statusCode: 401,
                statusMessage: "Unauthorized",
                message: "Authentication required. Please log in.",
            });
        }

        // Obter parâmetros de período da query
        const query = getQuery(event);
        const startDate = query.start_date as string;
        const endDate = query.end_date as string;


        // 2. Busca de eventos para o usuário autenticado com filtro de período
        let eventsQuery = client
            .from('events')
            .select('start_time, total_cost, total_revenue, profit_margin')
            .eq('user_id', user.id)
            .eq('status', 'completed')
            .order('start_time', { ascending: true });

        if (startDate && endDate) {
            eventsQuery = eventsQuery
                .gte('start_time', startDate)
                .lte('start_time', endDate);
        }

        const { data: eventsData, error } = await eventsQuery;

        if (error) {
            console.error('Supabase fetch error:', error); // Log do erro para depuração
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to fetch profit summary data',
                message: error.message,
            });
        }

        // 3. Agregação mensal dos dados
        const monthlySummary: { [key: string]: { cost: number, revenue: number, profit: number } } = {};

        eventsData.forEach(e => {
            // Ignora eventos com dados incompletos
            if (e.total_cost === null || e.total_revenue === null || e.profit_margin === null) return;

            const date = new Date(e.start_time);
            // Formata a chave como 'YYYY-MM' para garantir ordenação correta
            const yearMonthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;

            if (!monthlySummary[yearMonthKey]) {
                monthlySummary[yearMonthKey] = { cost: 0, revenue: 0, profit: 0 };
            }
            monthlySummary[yearMonthKey].cost += e.total_cost;
            monthlySummary[yearMonthKey].revenue += e.total_revenue;
            monthlySummary[yearMonthKey].profit += e.total_revenue - e.total_cost; // Calcula o lucro bruto
        });

        // 4. Transformação para o formato esperado pelo frontend
        const transformedChartData = Object.keys(monthlySummary)
            .sort() // Garante que os meses estejam em ordem cronológica
            .map(yearMonthKey => {
                const [year, month] = yearMonthKey.split('-');
                const dateObj = new Date(parseInt(year), parseInt(month) - 1); // Mês é 0-indexado
                // Formata a data para exibição no gráfico (ex: "Jan 23")
                const formattedDate = dateObj.toLocaleString('pt-BR', { month: 'short', year: '2-digit' });

                return {
                    date: formattedDate,
                    cost: monthlySummary[yearMonthKey].cost.toFixed(2),
                    revenue: monthlySummary[yearMonthKey].revenue.toFixed(2),
                    profit: monthlySummary[yearMonthKey].profit.toFixed(2),
                };
            });

        return transformedChartData; // Retorna os dados já formatados

    } catch (error: unknown) {
        const err = error as FetchError;
        console.error('API handler error:', err); // Log do erro para depuração

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || 'Internal Server Error',
            message: err.message,
        });
    }
});