import { getSupabaseClientAndUser } from '~~/server/utils/supabase';
import Stripe from 'stripe';

export default defineEventHandler(async (event) => {
  try {
    const { client, user } = await getSupabaseClientAndUser(event);
    const body = await readBody(event);
    const { priceId } = body;

    if (!priceId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Price ID is required',
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

    // Verificar se o usuário já tem uma subscription
    const { data: existingSubscription } = await client
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    let customerId = existingSubscription?.stripe_customer_id;

    // Se não tem customer no Stripe, criar um
    if (!customerId) {
      // O email está disponível no objeto user do Supabase
      const customer = await stripe.customers.create({
        email: user.email || undefined,
        metadata: {
          user_id: user.id,
        },
      });

      customerId = customer.id;

      // Salvar customer_id no banco
      if (existingSubscription) {
        await client
          .from('user_subscriptions')
          .update({ stripe_customer_id: customerId })
          .eq('user_id', user.id);
      } else {
        await client
          .from('user_subscriptions')
          .insert({
            user_id: user.id,
            stripe_customer_id: customerId,
            status: 'inactive',
          });
      }
    }

    // Criar sessão de checkout
    const baseUrl = useRuntimeConfig().public.baseUrl || 'http://localhost:3000';
    
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/subscription/cancel`,
      metadata: {
        user_id: user.id,
      },
    });

    return {
      sessionId: session.id,
      url: session.url,
    };
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal Server Error',
      message: error.message || 'Failed to create checkout session',
    });
  }
});

