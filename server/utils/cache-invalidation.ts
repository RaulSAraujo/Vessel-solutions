import type { H3Event } from 'h3'
import { invalidateCacheByTags, invalidateUserCache } from './cache'

/**
 * Utilitário para invalidação de cache baseada em operações CRUD
 */
export async function handleCacheInvalidation(
    event: H3Event,
    operation: 'create' | 'update' | 'delete',
    entity: string,
    userId?: string
) {
    try {
        // Tags baseadas na entidade
        const entityTags = {
            'clients': ['dynamic', 'reports'],
            'events': ['dynamic', 'reports'],
            'drinks': ['dynamic', 'reports'],
            'ingredients': ['dynamic', 'reports'],
            'suppliers': ['dynamic', 'reports'],
            'quotations': ['dynamic', 'reports'],
            'event-quotations': ['dynamic', 'reports'],
            'purchase-list': ['dynamic', 'reports'],
            'profile': ['profile']
        }

        const tags = entityTags[entity as keyof typeof entityTags] || ['dynamic']

        // Invalidar cache por tags
        await invalidateCacheByTags(tags)

        // Invalidar cache específico do usuário se disponível
        if (userId) {
            await invalidateUserCache(userId)
        }

        console.log(`Cache invalidated for ${operation} operation on ${entity}`)
    } catch (error) {
        console.error('Cache invalidation failed:', error)
        // Não falha a operação principal se a invalidação de cache falhar
    }
}

/**
 * Hook para invalidação automática após operações CRUD
 */
export function setupCacheInvalidationHooks() {
    // Este seria usado em endpoints que fazem operações de escrita
    // Exemplo de uso:
    // 
    // export default defineEventHandler(async (event) => {
    //   // ... lógica da operação
    //   
    //   // Após sucesso da operação
    //   await handleCacheInvalidation(event, 'create', 'clients', user.id)
    // })
}
