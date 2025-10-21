import { getSupabaseClientAndUser } from "../../utils/supabase";
import type { FetchError } from "ofetch";

export default defineEventHandler(async (event) => {
    try {
        const { client, user } = await getSupabaseClientAndUser(event);

        const avatarUrl = user.user_metadata?.avatar_url;
        console.log('Avatar URL encontrada:', avatarUrl);

        // Se existe um avatar, tentar remover do storage
        if (avatarUrl) {
            // Extrair o nome do arquivo da URL
            const fileName = avatarUrl.split('/').pop();
            console.log('Nome do arquivo extraído:', fileName);

            if (fileName) {
                console.log('Tentando remover arquivo:', fileName);
                const { error: deleteError } = await client.storage
                    .from('avatars')
                    .remove([fileName]);

                if (deleteError) {
                    console.error('Erro ao remover arquivo do storage:', deleteError);
                    throw createError({
                        statusCode: 500,
                        statusMessage: "Erro ao remover arquivo do storage",
                        message: deleteError.message
                    });
                } else {
                    console.log('Arquivo removido com sucesso do storage');
                }
            } else {
                console.warn('Não foi possível extrair o nome do arquivo da URL');
            }
        } else {
            console.log('Nenhum avatar encontrado nos metadados');
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
