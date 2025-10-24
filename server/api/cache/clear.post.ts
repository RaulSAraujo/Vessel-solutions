import { invalidateCacheByTags, invalidateUserCache } from '../../utils/cache'
import type { FetchError } from 'ofetch'

/**
 * Endpoint para limpar cache manualmente
 * POST /api/cache/clear
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

        const body = await readBody(event)
        const { tags, userId, all } = body

        if (all) {
            // Limpar todo o cache
            await invalidateCacheByTags(['reports', 'dynamic', 'profile', 'static'])
            await invalidateUserCache(user.id)

            return {
                success: true,
                message: 'All cache cleared successfully',
                clearedBy: user.id
            }
        }

        if (tags && Array.isArray(tags)) {
            // Limpar cache por tags específicas
            await invalidateCacheByTags(tags)

            return {
                success: true,
                message: `Cache cleared for tags: ${tags.join(', ')}`,
                tags
            }
        }

        if (userId) {
            // Limpar cache de usuário específico
            await invalidateUserCache(userId)

            return {
                success: true,
                message: `Cache cleared for user: ${userId}`,
                userId
            }
        }

        // Limpar cache do usuário atual
        await invalidateUserCache(user.id)

        return {
            success: true,
            message: `Cache cleared for current user: ${user.id}`,
            userId: user.id
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
