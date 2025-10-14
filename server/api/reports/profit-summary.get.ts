// api/reports/profit-summary.ts
import { getSupabaseClientAndUser } from '../../utils/supabase';
import type { FetchError } from 'ofetch';

export default defineEventHandler(async (event) => {
    try {
        const { client, user } = await getSupabaseClientAndUser(event);

        // 1. Validação de autenticação
        if (!user) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Unauthorized',
                message: 'User not authenticated.',
            });
        }

        // 2. Busca de eventos para o usuário autenticado
        const { data: eventsData, error } = await client
            .from('events')
            .select('start_time, total_cost, total_revenue, profit_margin')
            .eq('user_id', user.id)
            .order('start_time', { ascending: true });

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
                const formattedDate = dateObj.toLocaleString('en-US', { month: 'short', year: '2-digit' });

                return {
                    date: formattedDate,
                    cost: monthlySummary[yearMonthKey].cost,
                    revenue: monthlySummary[yearMonthKey].revenue,
                    profit: monthlySummary[yearMonthKey].profit,
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