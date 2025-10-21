import type { FetchError } from "ofetch";
import { getSupabaseClientAndUser } from "../../utils/supabase";

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);
        const body = await readBody(event);

        // Validar dados recebidos
        const { full_name, phone, avatar_url } = body;

        if (!full_name || typeof full_name !== 'string') {
            throw createError({
                statusCode: 400,
                statusMessage: "Nome completo é obrigatório"
            });
        }

        // Atualizar dados do usuário
        const { error } = await client.auth.updateUser({
            data: {
                full_name: full_name.trim(),
                phone: phone?.trim() || null,
                avatar_url: avatar_url?.trim() || null,
            }
        });

        if (error) {
            throw createError({
                statusCode: 400,
                statusMessage: error.message
            });
        }

        return {
            success: true,
            message: "Perfil atualizado com sucesso"
        };

    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Erro interno do servidor"
        });
    }
});
