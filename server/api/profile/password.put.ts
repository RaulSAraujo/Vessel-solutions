import type { FetchError } from "ofetch";
import { getSupabaseClientAndUser } from "../../utils/supabase";

export default defineEventHandler(async (event) => {
    try {
        const { client, user } = await getSupabaseClientAndUser(event);
        const body = await readBody(event);

        // Validar dados recebidos
        const { current_password, new_password } = body;

        if (!current_password || !new_password) {
            throw createError({
                statusCode: 400,
                statusMessage: "Senha atual e nova senha são obrigatórias"
            });
        }

        if (new_password.length < 8) {
            throw createError({
                statusCode: 400,
                statusMessage: "A nova senha deve ter no mínimo 8 caracteres"
            });
        }

        // Verificar se a senha atual está correta
        const { error: signInError } = await client.auth.signInWithPassword({
            email: user.email!,
            password: current_password,
        });

        if (signInError) {
            throw createError({
                statusCode: 400,
                statusMessage: "Senha atual incorreta"
            });
        }

        // Atualizar a senha
        const { error } = await client.auth.updateUser({
            password: new_password
        });

        if (error) {
            throw createError({
                statusCode: 400,
                statusMessage: error.message
            });
        }

        return {
            success: true,
            message: "Senha alterada com sucesso"
        };

    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Erro interno do servidor"
        });
    }
});
