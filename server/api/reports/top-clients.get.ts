import { getSupabaseClientAndUser } from '../../utils/supabase';
import type { FetchError } from 'ofetch';

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

        if (!user) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Unauthorized',
                message: 'User not authenticated.',
            });
        }

        // Buscar clientes com seus eventos e valores
        const { data: clientsData, error } = await client
            .from('clients')
            .select(`
                id,
                name,
                events!inner (
                    id,
                    total_cost,
                    created_at
                )
            `)
            .eq('user_id', user.id)
            .eq('events.status', 'completed');

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to fetch top clients',
                message: error.message,
            });
        }

        // Processar dados para calcular estatísticas por cliente
        const clientStats = clientsData?.map(client => {
            let events = client.events || [];

            // Filtrar eventos por período se especificado
            if (startDate && endDate) {
                events = events.filter(event => {
                    if (!event.created_at) return false;
                    const eventDate = new Date(event.created_at);
                    const start = new Date(startDate);
                    const end = new Date(endDate);
                    return eventDate >= start && eventDate <= end;
                });
            }

            const totalValue = events.reduce((sum, event) => sum + (event.total_cost || 0), 0);

            return {
                id: client.id,
                name: client.name,
                events: events.length,
                totalValue: totalValue
            };
        }).filter(client => client.events > 0) // Apenas clientes com eventos
            .sort((a, b) => b.totalValue - a.totalValue) // Ordenar por valor total
            .slice(0, 5); // Top 5 clientes

        return {
            data: clientStats
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
    maxAge: 10 * 60, // 10 minutos
    name: 'top-clients',
    getKey: async (event) => {
        try {
            const { user } = await getSupabaseClientAndUser(event);
            if (!user) return 'top-clients-no-auth'; // Fallback para não autenticado

            const query = getQuery(event);
            const startDate = query.start_date as string;
            const endDate = query.end_date as string;
            return `top-clients-${user.id}-${startDate || 'all'}-${endDate || 'all'}`;
        } catch {
            return 'top-clients-error'; // Fallback para erro de autenticação
        }
    }
});
