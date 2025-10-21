import { getSupabaseClientAndUser } from "../../utils/supabase";
import type { FetchError } from "ofetch";

export default defineEventHandler(async (event) => {
    try {
        const { client, user } = await getSupabaseClientAndUser(event);

        // Verificar se é uma requisição multipart/form-data
        const contentType = getHeader(event, 'content-type');
        console.log('Content-Type recebido:', contentType);

        if (!contentType?.includes('multipart/form-data')) {
            console.log('Content-Type inválido, esperado multipart/form-data');
            throw createError({
                statusCode: 400,
                statusMessage: "Content-Type deve ser multipart/form-data"
            });
        }

        // Ler o body como FormData
        const formData = await readMultipartFormData(event);
        console.log('FormData recebido:', formData?.length || 0, 'itens');

        if (!formData || formData.length === 0) {
            console.log('Nenhum arquivo foi enviado');
            throw createError({
                statusCode: 400,
                statusMessage: "Nenhum arquivo foi enviado"
            });
        }

        const file = formData[0];
        console.log('Arquivo recebido:', {
            filename: file.filename,
            type: file.type,
            size: file.data?.length || 0
        });

        if (!file.data || !file.filename) {
            console.log('Arquivo inválido:', { hasData: !!file.data, hasFilename: !!file.filename });
            throw createError({
                statusCode: 400,
                statusMessage: "Arquivo inválido"
            });
        }

        // Validar tipo de arquivo
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type || '')) {
            throw createError({
                statusCode: 400,
                statusMessage: "Tipo de arquivo não permitido. Use apenas imagens (JPEG, PNG, GIF, WebP)"
            });
        }

        // Validar tamanho (máximo 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.data.length > maxSize) {
            throw createError({
                statusCode: 400,
                statusMessage: "Arquivo muito grande. Tamanho máximo permitido: 5MB"
            });
        }

        // Verificar se existe avatar antigo e removê-lo
        const currentAvatarUrl = user.user_metadata?.avatar_url;
        if (currentAvatarUrl) {
            const oldFileName = currentAvatarUrl.split('/').pop();
            if (oldFileName) {
                console.log('Removendo avatar antigo:', oldFileName);
                const { error: deleteError } = await client.storage
                    .from('avatars')
                    .remove([oldFileName]);

                if (deleteError) {
                    console.warn('Erro ao remover avatar antigo:', deleteError);
                    // Não falhar se não conseguir remover o arquivo antigo
                } else {
                    console.log('Avatar antigo removido com sucesso');
                }
            }
        }

        // Criar nome único para o arquivo
        const fileExt = file.filename.split('.').pop();
        const fileName = `${user.id}.${fileExt}`;
        const filePath = `${fileName}`;

        console.log('Fazendo upload para:', filePath);
        console.log('User ID:', user.id);

        // Fazer upload para o Supabase Storage
        const { error: uploadError } = await client.storage
            .from('avatars')
            .upload(filePath, file.data, {
                cacheControl: '3600',
                upsert: true,
                contentType: file.type
            });

        console.log('Resultado do upload:', { error: uploadError?.message || 'Sucesso' });

        if (uploadError) {
            // Se o bucket não existir, tentar criar
            if (uploadError.message.includes('Bucket not found')) {
                // Criar o bucket se não existir
                const { error: bucketError } = await client.storage.createBucket('avatars', {
                    public: true,
                    allowedMimeTypes: allowedTypes,
                    fileSizeLimit: maxSize
                });

                if (bucketError) {
                    throw createError({
                        statusCode: 500,
                        statusMessage: "Erro ao configurar sistema de upload",
                        message: bucketError.message
                    });
                }

                // Tentar upload novamente após criar o bucket
                const { error: retryError } = await client.storage
                    .from('avatars')
                    .upload(filePath, file.data, {
                        cacheControl: '3600',
                        upsert: true,
                        contentType: file.type
                    });

                if (retryError) {
                    throw createError({
                        statusCode: 500,
                        statusMessage: "Erro ao fazer upload do arquivo",
                        message: retryError.message
                    });
                }
            } else {
                throw createError({
                    statusCode: 500,
                    statusMessage: "Erro ao fazer upload do arquivo",
                    message: uploadError.message
                });
            }
        }

        // Obter a URL pública
        const { data } = client.storage
            .from('avatars')
            .getPublicUrl(filePath);

        // Atualizar o avatar_url nos metadados do usuário com a URL pública
        const { error: updateError } = await client.auth.updateUser({
            data: { avatar_url: data.publicUrl }
        });

        if (updateError) {
            throw createError({
                statusCode: 500,
                statusMessage: "Erro ao atualizar perfil do usuário",
                message: updateError.message
            });
        }

        return {
            success: true,
            message: "Avatar atualizado com sucesso",
            avatar_url: data.publicUrl,
            avatar_path: filePath
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
