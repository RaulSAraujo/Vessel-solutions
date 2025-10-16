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

        // Buscar eventos recentes
        const { data: recentEvents, error: eventsError } = await client
            .from('events')
            .select('id, name, created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(3);

        // Buscar clientes recentes
        const { data: recentClients, error: clientsError } = await client
            .from('clients')
            .select('id, name, created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(2);

        // Buscar bebidas recentes
        const { data: recentDrinks, error: drinksError } = await client
            .from('drinks')
            .select('id, name, created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(2);

        if (eventsError || clientsError || drinksError) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to fetch recent activity',
                message: eventsError?.message || clientsError?.message || drinksError?.message,
            });
        }

        // Combinar e formatar as atividades
        const activities = [];

        // Adicionar eventos
        recentEvents?.forEach(event => {
            activities.push({
                id: `event-${event.id}`,
                type: 'event',
                title: 'Novo evento criado',
                description: event.name,
                timestamp: formatTimeAgo(event.created_at),
                icon: 'mdi-calendar-check',
                color: 'primary'
            });
        });

        // Adicionar clientes
        recentClients?.forEach(client => {
            activities.push({
                id: `client-${client.id}`,
                type: 'client',
                title: 'Cliente cadastrado',
                description: client.name,
                timestamp: formatTimeAgo(client.created_at || ''),
                icon: 'mdi-account-plus',
                color: 'success'
            });
        });

        // Adicionar bebidas
        recentDrinks?.forEach(drink => {
            activities.push({
                id: `drink-${drink.id}`,
                type: 'drink',
                title: 'Nova bebida adicionada',
                description: drink.name,
                timestamp: formatTimeAgo(drink.created_at || ''),
                icon: 'mdi-glass-cocktail',
                color: 'warning'
            });
        });

        // Ordenar por timestamp (mais recente primeiro)
        activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        return {
            data: activities.slice(0, 5) // Retorna apenas as 5 mais recentes
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

function formatTimeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
        return 'Agora mesmo';
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} minuto${minutes > 1 ? 's' : ''} atrás`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} hora${hours > 1 ? 's' : ''} atrás`;
    } else {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} dia${days > 1 ? 's' : ''} atrás`;
    }
}
