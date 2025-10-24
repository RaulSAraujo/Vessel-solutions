import { getSupabaseClientAndUser } from '../../utils/supabase';
import { CACHE_CONFIGS, generateCacheKey } from '../../utils/cache';
import type { FetchError } from 'ofetch'

export default cachedEventHandler(async (event) => {
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

        let eventsQuery = client
            .from('events')
            .select('start_time')
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
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to fetch monthly events data',
                message: error.message,
            });
        }

        const monthlyEventsMap: { [key: string]: number } = {}; // { 'YYYY-MM': count }

        // Agrupa e conta os eventos por mês/ano
        eventsData.forEach(e => {
            const date = new Date(e.start_time);
            const yearMonth = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
            monthlyEventsMap[yearMonth] = (monthlyEventsMap[yearMonth] || 0) + 1;
        });

        // Garante a ordem cronológica dos meses
        const sortedYearMonths = Object.keys(monthlyEventsMap).sort();

        // Prepara o array de dados para o BarChart
        const chartData: { month: string; 'Número de Eventos': number }[] = [];

        sortedYearMonths.forEach(yearMonth => {
            const [year, month] = yearMonth.split('-');
            const date = new Date(parseInt(year), parseInt(month) - 1); // Mês é 0-indexado
            const formattedMonth = date.toLocaleString('pt-BR', { month: 'short', year: '2-digit' });

            chartData.push({
                month: formattedMonth, // Mês já formatado
                'Número de Eventos': monthlyEventsMap[yearMonth], // Contagem de eventos
            });
        });

        // Define as categorias da série para a legenda do gráfico
        const chartSeriesCategories = {
            'Número de Eventos': {
                name: 'Número de Eventos',
                color: "#3b82f6", // Cor da barra
            },
        };

        return {
            data: chartData, // Array de objetos com mês formatado e contagem
            categories: chartSeriesCategories, // Objeto de configuração da série
        };
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || 'Internal Server Error',
            message: err.message,
        });
    }
}, {
    maxAge: CACHE_CONFIGS.REPORTS.maxAge,
    name: 'monthly-events',
    getKey: async (event) => {
        try {
            const { user } = await getSupabaseClientAndUser(event);
            const query = getQuery(event);
            return generateCacheKey(event, 'monthly-events', user, {
                start_date: query.start_date,
                end_date: query.end_date
            });
        } catch {
            return `monthly-events-error-${Date.now()}`;
        }
    }
});