import { getSupabaseClientAndUser } from '../../utils/supabase';
import { CACHE_CONFIGS, generateCacheKey } from '../../utils/cache';
import type { FetchError } from 'ofetch';
import type { Tables } from '../../types/database';

// Tipos baseados no database
type EventWithClient = Tables<'events'> & {
    clients: Pick<Tables<'clients'>, 'name'>;
};

type Client = Tables<'clients'>;
type Drink = Tables<'drinks'>;

interface ActivityItem {
    id: string;
    type: 'event' | 'client' | 'drink';
    title: string;
    description: string;
    timestamp: string;
    icon: string;
    color: string;
}

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

        // Buscar eventos recentes com dados do cliente
        let eventsQuery = client
            .from('events')
            .select(`
                id, 
                created_at,
                location,
                clients!inner(name)
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(2);

        if (startDate && endDate) {
            eventsQuery = eventsQuery
                .gte('created_at', startDate)
                .lte('created_at', endDate);
        }

        const { data: recentEvents, error: eventsError } = await eventsQuery as { data: EventWithClient[] | null; error: FetchError };

        // Buscar clientes recentes
        let clientsQuery = client
            .from('clients')
            .select('id, name, created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1);

        if (startDate && endDate) {
            clientsQuery = clientsQuery
                .gte('created_at', startDate)
                .lte('created_at', endDate);
        }

        const { data: recentClients, error: clientsError } = await clientsQuery as { data: Client[] | null; error: FetchError };

        // Buscar bebidas recentes
        let drinksQuery = client
            .from('drinks')
            .select('id, name, created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1);

        if (startDate && endDate) {
            drinksQuery = drinksQuery
                .gte('created_at', startDate)
                .lte('created_at', endDate);
        }

        const { data: recentDrinks, error: drinksError } = await drinksQuery as { data: Drink[] | null; error: FetchError };

        if (eventsError || clientsError || drinksError) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to fetch recent activity',
                message: eventsError?.message || clientsError?.message || drinksError?.message,
            });
        }

        // Combinar e formatar as atividades
        const activities: ActivityItem[] = [];

        // Adicionar eventos
        recentEvents?.forEach(event => {
            if (event.created_at) {
                const eventName = `${event.clients.name} - ${event.location}`;
                activities.push({
                    id: `event-${event.id}`,
                    type: 'event',
                    title: 'Novo evento criado',
                    description: eventName,
                    timestamp: formatTimeAgo(event.created_at),
                    icon: 'mdi-calendar-check',
                    color: 'primary'
                });
            }
        });

        // Adicionar clientes
        recentClients?.forEach(client => {
            if (client.created_at) {
                activities.push({
                    id: `client-${client.id}`,
                    type: 'client',
                    title: 'Cliente cadastrado',
                    description: client.name,
                    timestamp: formatTimeAgo(client.created_at),
                    icon: 'mdi-account-plus',
                    color: 'success'
                });
            }
        });

        // Adicionar bebidas
        recentDrinks?.forEach(drink => {
            if (drink.created_at) {
                activities.push({
                    id: `drink-${drink.id}`,
                    type: 'drink',
                    title: 'Nova bebida adicionada',
                    description: drink.name,
                    timestamp: formatTimeAgo(drink.created_at),
                    icon: 'mdi-glass-cocktail',
                    color: 'warning'
                });
            }
        });

        // Ordenar por data de criação (mais recente primeiro)
        activities.sort((a, b) => {
            // Encontrar as datas originais baseadas no ID
            let aDate: string | null = null;
            let bDate: string | null = null;

            if (a.id.startsWith('event-')) {
                const eventId = a.id.replace('event-', '');
                aDate = recentEvents?.find(e => e.id === eventId)?.created_at || null;
            } else if (a.id.startsWith('client-')) {
                const clientId = a.id.replace('client-', '');
                aDate = recentClients?.find(c => c.id === clientId)?.created_at || null;
            } else if (a.id.startsWith('drink-')) {
                const drinkId = a.id.replace('drink-', '');
                aDate = recentDrinks?.find(d => d.id === drinkId)?.created_at || null;
            }

            if (b.id.startsWith('event-')) {
                const eventId = b.id.replace('event-', '');
                bDate = recentEvents?.find(e => e.id === eventId)?.created_at || null;
            } else if (b.id.startsWith('client-')) {
                const clientId = b.id.replace('client-', '');
                bDate = recentClients?.find(c => c.id === clientId)?.created_at || null;
            } else if (b.id.startsWith('drink-')) {
                const drinkId = b.id.replace('drink-', '');
                bDate = recentDrinks?.find(d => d.id === drinkId)?.created_at || null;
            }

            if (!aDate || !bDate) return 0;
            return new Date(bDate).getTime() - new Date(aDate).getTime();
        });

        return {
            data: activities.slice(0, 3) // Retorna apenas as 3 mais recentes
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
    maxAge: CACHE_CONFIGS.DYNAMIC.maxAge,
    name: 'recent-activity',
    getKey: async (event) => {
        try {
            const { user } = await getSupabaseClientAndUser(event);
            const query = getQuery(event);
            return generateCacheKey(event, 'recent-activity', user, {
                start_date: query.start_date,
                end_date: query.end_date
            });
        } catch {
            return `recent-activity-error-${Date.now()}`;
        }
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
