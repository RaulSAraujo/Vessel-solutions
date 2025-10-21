import type { FetchError } from 'ofetch'
import type { User } from '@supabase/supabase-js'

export interface ProfileData {
    full_name?: string;
    phone?: string;
    avatar_path?: string;
}

export interface PasswordChangeData {
    current_password: string;
    new_password: string;
    confirm_password: string;
}

export function useProfileApi() {
    const loading = ref(false);
    const errorMessage = ref<string | null>(null);

    async function updateProfile(data: ProfileData) {
        try {
            loading.value = true;
            errorMessage.value = null;

            const supabase = useSupabaseClient();

            const { error } = await supabase.auth.updateUser({
                data: {
                    full_name: data.full_name,
                    phone: data.phone,
                    avatar_path: data.avatar_path,
                }
            });

            if (error) throw error;

            return true;
        } catch (error: unknown) {
            const err = error as FetchError;
            errorMessage.value = err.message;
            return false;
        } finally {
            loading.value = false;
        }
    }

    async function changePassword(data: PasswordChangeData) {
        try {
            loading.value = true;
            errorMessage.value = null;

            const supabase = useSupabaseClient();

            // Primeiro, verificar se a senha atual está correta
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: (await supabase.auth.getUser()).data.user?.email || '',
                password: data.current_password,
            });

            if (signInError) {
                throw new Error('Senha atual incorreta');
            }

            // Atualizar a senha
            const { error } = await supabase.auth.updateUser({
                password: data.new_password
            });

            if (error) throw error;

            return true;
        } catch (error: unknown) {
            const err = error as Error;
            errorMessage.value = err.message;
            return false;
        } finally {
            loading.value = false;
        }
    }

    async function uploadAvatar(file: File) {
        try {
            loading.value = true;
            errorMessage.value = null;

            // Criar FormData para enviar o arquivo
            const formData = new FormData();
            formData.append('file', file);

            // Fazer upload via endpoint do servidor
            const response = await $fetch('/api/profile/upload', {
                method: 'POST',
                body: formData
            });

            return response.avatar_url;
        } catch (error: unknown) {
            const err = error as Error;
            console.error('Erro no upload:', err);
            errorMessage.value = err.message;
            return null;
        } finally {
            loading.value = false;
        }
    }

    // Função para obter a URL do avatar
    function getAvatarUrl(user: User | null) {
        if (!user) return null;

        // Retornar diretamente a URL salva nos metadados
        return user.user_metadata?.avatar_url || null;
    }

    // Função para remover o avatar
    async function removeAvatar() {
        try {
            loading.value = true;
            errorMessage.value = null;

            // Fazer requisição para o endpoint de remoção
            await $fetch('/api/profile/remove-avatar', {
                method: 'POST'
            });

            return true;
        } catch (error: unknown) {
            const err = error as Error;
            errorMessage.value = err.message;
            return false;
        } finally {
            loading.value = false;
        }
    }

    return {
        loading: readonly(loading),
        errorMessage: readonly(errorMessage),
        updateProfile,
        changePassword,
        uploadAvatar,
        getAvatarUrl,
        removeAvatar,
    };
}
