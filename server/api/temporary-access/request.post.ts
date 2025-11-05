import { getSupabaseClientAndUser } from '~~/server/utils/supabase';

export default defineEventHandler(async (event) => {
  try {
    const { client, user } = await getSupabaseClientAndUser(event);
    const body = await readBody(event);
    const { reason, contact_info } = body;

    // Validação básica
    if (!reason || reason.trim().length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'O motivo da solicitação é obrigatório',
      });
    }

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

    // Criar registro de solicitação na tabela temporary_access com status 'pending'
    // O admin aprovará manualmente no Supabase Dashboard ou via aplicação futura
    const { data: request, error: requestError } = await client
      .from('temporary_access')
      .insert({
        user_id: user.id,
        reason: reason.trim(),
        contact_info: contact_info?.trim() || null,
        status: 'pending',
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (requestError) {
      console.error('Error creating temporary access request:', requestError);
      throw createError({
        statusCode: 500,
        statusMessage: 'Internal Server Error',
        message: 'Erro ao criar solicitação de acesso temporário. Tente novamente.',
      });
    }

    // Retornar sucesso - a solicitação foi salva e será avaliada pelo admin
    return {
      success: true,
      message: 'Sua solicitação de acesso temporário foi enviada com sucesso. Nossa equipe avaliará e entrará em contato em breve.',
      request_id: request.id,
    };
  } catch (error: any) {
    console.error('Error requesting temporary access:', error);
    
    // Se já é um erro criado, apenas relançar
    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal Server Error',
      message: error.message || 'Failed to request temporary access',
    });
  }
});

