import { getSupabaseClientAndUser } from '../../utils/supabase';
import type { FetchError } from 'ofetch';

export default defineEventHandler(async (event) => {
    try {
        const { client, user } = await getSupabaseClientAndUser(event);

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
                events (
                    id,
                    total_cost
                )
            `)
            .eq('user_id', user.id);

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to fetch top clients',
                message: error.message,
            });
        }

        // Processar dados para calcular estatísticas por cliente
        const clientStats = clientsData?.map(client => {
            const events = client.events || [];
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
});
