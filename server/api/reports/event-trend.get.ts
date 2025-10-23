import { getSupabaseClientAndUser } from '../../utils/supabase';
import type { FetchError } from 'ofetch';

export default defineEventHandler(async (event) => {
    try {
        const { client, user } = await getSupabaseClientAndUser(event);

        // Obter parâmetros de período da query
        const query = getQuery(event);
        const startDate = query.start_date as string;
        const endDate = query.end_date as string;

        // Buscar eventos com filtro de período
        let eventsQuery = client
            .from('events')
            .select('start_time, total_revenue')
            .eq('user_id', user.id)
            .eq('status', 'completed')
            .order('start_time', { ascending: true });

        if (startDate && endDate) {
            eventsQuery = eventsQuery
                .gte('start_time', startDate)
                .lte('start_time', endDate);
        } else {
            // Fallback para últimos 6 meses se não houver período especificado
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            eventsQuery = eventsQuery.gte('start_time', sixMonthsAgo.toISOString());
        }

        const { data: eventsData, error } = await eventsQuery;

        if (error) {
            console.error('Supabase fetch error:', error);
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to fetch event trend data',
                message: error.message,
            });
        }

        // Agrupar por mês
        const monthlyData: { [key: string]: { events: number, revenue: number } } = {};

        eventsData?.forEach(event => {
            const date = new Date(event.start_time);
            const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;

            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = { events: 0, revenue: 0 };
            }

            monthlyData[monthKey].events += 1;
            monthlyData[monthKey].revenue += event.total_revenue || 0;
        });

        // Transformar para o formato esperado pelo frontend
        const transformedData = Object.keys(monthlyData)
            .sort()
            .map(monthKey => {
                const [year, month] = monthKey.split('-');
                const dateObj = new Date(parseInt(year), parseInt(month) - 1);
                const formattedMonth = dateObj.toLocaleString('pt-BR', { month: 'short', year: '2-digit' });

                return {
                    month: formattedMonth,
                    events: monthlyData[monthKey].events,
                    revenue: Math.round(monthlyData[monthKey].revenue * 100) / 100,
                };
            });

        return transformedData;

    } catch (error: unknown) {
        const err = error as FetchError;
        console.error('API handler error:', err);

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || 'Internal Server Error',
            message: err.message,
        });
    }
});
