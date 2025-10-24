/* eslint-disable @typescript-eslint/no-explicit-any */
import type { H3Event } from 'h3'

/**
 * Utilitário para cache avançado com diferentes estratégias
 */

export interface CacheConfig {
    maxAge: number // em segundos
    name: string
    tags?: string[] // tags para invalidação seletiva
    vary?: string[] // headers que afetam o cache
}

/**
 * Gera uma chave de cache baseada no usuário e parâmetros
 */
export function generateCacheKey(
    event: H3Event,
    baseName: string,
    user?: { id: string } | null,
    additionalParams?: Record<string, any>
): string {
    const query = getQuery(event)
    const params = {
        userId: user?.id || 'anonymous',
        ...query,
        ...additionalParams
    }

    // Ordena os parâmetros para garantir consistência
    const sortedParams = Object.keys(params)
        .sort()
        .map(key => `${key}:${params[key as keyof typeof params]}`)
        .join('|')

    return `${baseName}-${sortedParams}`
}

/**
 * Configurações de cache otimizadas para diferentes tipos de dados
 */
export const CACHE_CONFIGS = {
    // Reports - dados que mudam menos frequentemente
    REPORTS: {
        maxAge: 10 * 60 // 10 minutos
    },

    // Dados dinâmicos - mudam mais frequentemente
    DYNAMIC: {
        maxAge: 5 * 60 // 5 minutos
    },

    // Dados de perfil - mudam ocasionalmente
    PROFILE: {
        maxAge: 2 * 60 // 2 minutos
    },

    // Dados estáticos - raramente mudam
    STATIC: {
        maxAge: 30 * 60 // 30 minutos
    }
} as const

/**
 * Cria um cachedEventHandler com configuração otimizada
 */
export function createCachedHandler(
    handler: (event: H3Event) => Promise<any>,
    config: CacheConfig,
    getKey: (event: H3Event) => string
) {
    return cachedEventHandler(handler, {
        maxAge: config.maxAge,
        name: config.name,
        getKey
        // tags e vary não são suportados diretamente pelo cachedEventHandler
        // mas podem ser implementados em storage customizado
    })
}

/**
 * Invalida cache por tags (placeholder para futuras implementações)
 */
export async function invalidateCacheByTags(tags: string[]) {
    // Com cachedEventHandler, o cache é gerenciado automaticamente pelo Nitro
    // Esta função é um placeholder para futuras implementações
    console.log(`Cache invalidation requested for tags: ${tags.join(', ')}`)
}

/**
 * Invalida cache por usuário (placeholder para futuras implementações)
 */
export async function invalidateUserCache(userId: string) {
    // Com cachedEventHandler, o cache é gerenciado automaticamente pelo Nitro
    // Esta função é um placeholder para futuras implementações
    console.log(`Cache invalidation requested for user: ${userId}`)
}
