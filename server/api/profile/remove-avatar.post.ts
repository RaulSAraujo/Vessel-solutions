import { getSupabaseClientAndUser } from "../../utils/supabase";
import type { FetchError } from "ofetch";

export default defineEventHandler(async (event) => {
    try {
        const { client, user } = await getSupabaseClientAndUser(event);

        const avatarUrl = user.user_metadata?.avatar_url as string | undefined;
        const avatarPath = user.user_metadata?.avatar_path as string | undefined;

        // Se existe um avatar, tentar remover do storage
        // Tentar usar avatar_path primeiro, depois avatar_url
        let fileNameToDelete: string | null = null;

        if (avatarPath) {
            fileNameToDelete = avatarPath;
        } else if (avatarUrl) {
            // Extrair o nome do arquivo da URL
            fileNameToDelete = avatarUrl.split('/').pop() || null;
        }

        if (fileNameToDelete) {
            const { error: deleteError } = await client.storage
                .from('avatars')
                .remove([fileNameToDelete]);

            if (deleteError) {
                throw createError({
                    statusCode: 500,
                    statusMessage: "Erro ao remover arquivo do storage",
                    message: deleteError.message
                });
            }
        }

        // Remover o avatar_url e avatar_path dos metadados do usuário
        const { error: updateError } = await client.auth.updateUser({
            data: { 
                avatar_url: null,
                avatar_path: null
            }
        });

        if (updateError) {
            throw createError({
                statusCode: 500,
                statusMessage: "Erro ao remover avatar do perfil",
                message: updateError.message
            });
        }

        return {
            success: true,
            message: "Avatar removido com sucesso"
        };

    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Erro interno do servidor",
            message: err.message
        });
    }
});
