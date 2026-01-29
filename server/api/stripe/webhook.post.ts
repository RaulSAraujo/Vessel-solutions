import Stripe from 'stripe';
import { getSupabaseServiceRole } from '~~/server/utils/supabase';

export default defineEventHandler(async (event) => {
  try {
    const stripeSecretKey = useRuntimeConfig().stripeSecretKey;
    const stripeWebhookSecret = useRuntimeConfig().stripeWebhookSecret;

    if (!stripeSecretKey || !stripeWebhookSecret) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Internal Server Error',
        message: 'Stripe configuration missing',
      });
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-10-29.clover',
    });

    const body = await readRawBody(event);
    const signature = getHeader(event, 'stripe-signature');

    if (!signature || !body) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Missing signature or body',
      });
    }

    // Verificar webhook signature
    let stripeEvent: Stripe.Event;
    try {
      stripeEvent = stripe.webhooks.constructEvent(
        body,
        signature,
        stripeWebhookSecret
      );
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: `Webhook Error: ${err.message}`,
      });
    }

    const supabaseAdmin = await getSupabaseServiceRole(event);

    // Processar diferentes tipos de eventos
    switch (stripeEvent.type) {
      case 'checkout.session.completed': {
        const session = stripeEvent.data.object as Stripe.Checkout.Session;
        const subscriptionId = session.subscription as string;
        const customerId = session.customer as string;

        if (subscriptionId && customerId) {
          const subscriptionResponse = await stripe.subscriptions.retrieve(subscriptionId);
          const subscription = subscriptionResponse as unknown as Stripe.Subscription;
          const userId = session.metadata?.user_id;

          if (userId) {
            // Atualizar ou criar subscription no banco
            await supabaseAdmin
              .from('user_subscriptions')
              .upsert({
                user_id: userId,
                stripe_customer_id: customerId,
                stripe_subscription_id: subscriptionId,
                stripe_price_id: subscription.items.data[0]?.price.id,
                status: subscription.status,
                current_period_start: new Date((subscription as { current_period_start?: number }).current_period_start! * 1000).toISOString(),
                current_period_end: new Date((subscription as { current_period_end?: number }).current_period_end! * 1000).toISOString(),
                cancel_at_period_end: subscription.cancel_at_period_end,
              }, {
                onConflict: 'user_id',
              });
          }
        }
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = stripeEvent.data.object as Stripe.Subscription & { current_period_start?: number; current_period_end?: number };
        
        await supabaseAdmin
          .from('user_subscriptions')
          .update({
            status: subscription.status,
            current_period_start: subscription.current_period_start != null ? new Date(subscription.current_period_start * 1000).toISOString() : undefined,
            current_period_end: subscription.current_period_end != null ? new Date(subscription.current_period_end * 1000).toISOString() : undefined,
            cancel_at_period_end: subscription.cancel_at_period_end,
          })
          .eq('stripe_subscription_id', subscription.id);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = stripeEvent.data.object as Stripe.Invoice & { subscription?: string };
        const subscriptionId = invoice.subscription as string | undefined;

        if (subscriptionId) {
          await supabaseAdmin
            .from('user_subscriptions')
            .update({
              status: 'active',
            })
            .eq('stripe_subscription_id', subscriptionId);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = stripeEvent.data.object as Stripe.Invoice & { subscription?: string };
        const subscriptionId = invoice.subscription as string | undefined;

        if (subscriptionId) {
          await supabaseAdmin
            .from('user_subscriptions')
            .update({
              status: 'past_due',
            })
            .eq('stripe_subscription_id', subscriptionId);
        }
        break;
      }
    }

    return { received: true };
  } catch (error: any) {
    console.error('Webhook error:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal Server Error',
      message: error.message || 'Webhook processing failed',
    });
  }
});

