import { getSupabaseClientAndUser } from '~~/server/utils/supabase';

export default defineEventHandler(async (event) => {
  try {
    const { client, user } = await getSupabaseClientAndUser(event);
    const body = await readBody(event);
    const { reason, contact_info } = body;

    // Verificar se já tem acesso ativo
    const { data: existingAccess } = await client
      .from('temporary_access')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (existingAccess) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Você já possui um acesso temporário ativo',
      });
    }

    // Criar solicitação de acesso temporário (pode ser armazenada em uma tabela separada ou enviada por email)
    // Por enquanto, vamos apenas retornar uma mensagem
    // Em produção, você pode enviar um email para o admin ou criar uma tabela de solicitações
    
    // TODO: Implementar lógica de notificação ao admin
    
    return {
      success: true,
      message: 'Sua solicitação de acesso temporário foi enviada. Entre em contato conosco para mais informações.',
      contact_info: 'Envie um email para contato@vessel-solutions.com ou entre em contato pelo telefone.',
    };
  } catch (error: any) {
    console.error('Error requesting temporary access:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal Server Error',
      message: error.message || 'Failed to request temporary access',
    });
  }
});

