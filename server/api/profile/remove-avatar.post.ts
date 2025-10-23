import { getSupabaseClientAndUser } from "../../utils/supabase";
import type { FetchError } from "ofetch";

export default defineEventHandler(async (event) => {
    try {
        const { client, user } = await getSupabaseClientAndUser(event);

        const avatarUrl = user.user_metadata?.avatar_url;

        // Se existe um avatar, tentar remover do storage
        if (avatarUrl) {
            // Extrair o nome do arquivo da URL
            const fileName = avatarUrl.split('/').pop();

            if (fileName) {
                const { error: deleteError } = await client.storage
                    .from('avatars')
                    .remove([fileName]);

                if (deleteError) {
                    throw createError({
                        statusCode: 500,
                        statusMessage: "Erro ao remover arquivo do storage",
                        message: deleteError.message
                    });
                }
            } else {
                console.warn('Não foi possível extrair o nome do arquivo da URL');
            }
        }

        // Remover a URL do avatar dos metadados do usuário
        const { error: updateError } = await client.auth.updateUser({
            data: { avatar_url: null }
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
