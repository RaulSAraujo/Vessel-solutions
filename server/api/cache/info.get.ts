import { CACHE_CONFIGS } from '../../utils/cache'
import type { FetchError } from 'ofetch'

/**
 * Endpoint para obter informações sobre configurações de cache
 * GET /api/cache/info
 */
export default defineEventHandler(async (event) => {
    try {
        const { user } = await getSupabaseClientAndUser(event)

        if (!user) {
            throw createError({
                statusCode: 401,
                statusMessage: "Unauthorized",
                message: "Authentication required",
            })
        }

        return {
            success: true,
            data: {
                configurations: CACHE_CONFIGS,
                description: {
                    REPORTS: 'Cache para relatórios e dados analíticos (10 minutos)',
                    DYNAMIC: 'Cache para dados que mudam frequentemente (5 minutos)',
                    PROFILE: 'Cache para dados de perfil (2 minutos)',
                    STATIC: 'Cache para dados estáticos (30 minutos)'
                },
                usage: {
                    'Reports endpoints': 'Use REPORTS config',
                    'List endpoints (clients, events, etc)': 'Use DYNAMIC config',
                    'Profile endpoints': 'Use PROFILE config',
                    'Static data (units, etc)': 'Use STATIC config'
                }
            }
        }

    } catch (error: unknown) {
        const err = error as FetchError

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || 'Internal Server Error',
            message: err.message,
        })
    }
})
