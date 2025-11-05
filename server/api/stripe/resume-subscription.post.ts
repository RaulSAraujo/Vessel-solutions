import { getSupabaseClientAndUser } from '~~/server/utils/supabase';
import Stripe from 'stripe';

export default defineEventHandler(async (event) => {
  try {
    const { client, user } = await getSupabaseClientAndUser(event);

    // Buscar subscription do usuário
    const { data: subscription, error } = await client
      .from('user_subscriptions')
      .select('stripe_subscription_id')
      .eq('user_id', user.id)
      .single();

    if (error || !subscription?.stripe_subscription_id) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Subscription not found',
      });
    }

    // Inicializar Stripe
    const stripeSecretKey = useRuntimeConfig().stripeSecretKey;
    if (!stripeSecretKey) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Internal Server Error',
        message: 'Stripe secret key not configured',
      });
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-10-29.clover',
    });

    // Retomar assinatura no Stripe
    await stripe.subscriptions.update(subscription.stripe_subscription_id, {
      cancel_at_period_end: false,
    });

    // Atualizar no banco
    await client
      .from('user_subscriptions')
      .update({ cancel_at_period_end: false })
      .eq('user_id', user.id);

    return { success: true, message: 'Subscription resumed successfully' };
  } catch (error: any) {
    console.error('Error resuming subscription:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal Server Error',
      message: error.message || 'Failed to resume subscription',
    });
  }
});

