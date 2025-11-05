import { getSupabaseClientAndUser } from '~~/server/utils/supabase';

export default defineEventHandler(async (event) => {
  try {
    const { client, user } = await getSupabaseClientAndUser(event);

    // Buscar subscription do usuário
    const { data: subscription, error: subError } = await client
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (subError && subError.code !== 'PGRST116') {
      throw createError({
        statusCode: 500,
        statusMessage: 'Internal Server Error',
        message: subError.message,
      });
    }

    // Buscar acesso temporário ativo
    // Primeiro, marcar como expirados os que já passaram da data (atualização automática)
    // Isso é feito silenciosamente - se falhar, não impede a busca
    try {
      await client.rpc('mark_expired_temporary_access');
    } catch (rpcError) {
      // Se a função RPC falhar, apenas logar e continuar
      // O trigger já deve ter atualizado na inserção/atualização
      console.warn('Failed to mark expired temporary access:', rpcError);
    }
    
    // Depois, buscar apenas os que estão realmente ativos e não expirados
    const { data: tempAccess } = await client
      .from('temporary_access')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .gt('expires_at', new Date().toISOString())
      .order('expires_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    // Verificar se tem acesso ativo
    const hasActiveSubscription = subscription?.status === 'active' || subscription?.status === 'trialing';
    const hasTemporaryAccess = !!tempAccess;
    const hasAccess = hasActiveSubscription || hasTemporaryAccess;

    return {
      hasAccess,
      hasActiveSubscription,
      hasTemporaryAccess,
      subscription: subscription ? {
        status: subscription.status,
        currentPeriodEnd: subscription.current_period_end,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      } : null,
      temporaryAccess: tempAccess ? {
        expiresAt: tempAccess.expires_at,
        startsAt: tempAccess.starts_at,
        reason: tempAccess.reason,
      } : null,
    };
  } catch (error: any) {
    console.error('Error checking subscription status:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal Server Error',
      message: error.message || 'Failed to check subscription status',
    });
  }
});

