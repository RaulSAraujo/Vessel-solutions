export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser();

  // Se não estiver autenticado, o middleware de auth já redireciona
  if (!user.value) {
    return;
  }

  // Rotas que não precisam de verificação de assinatura
  const publicRoutes = [
    '/',
    '/auth/login',
    '/auth/register',
    '/auth/callback', // Callback verifica assinatura internamente
    '/profile', // Profile tem sua própria verificação de assinatura
    '/subscription/success', // Páginas de callback do Stripe
    '/subscription/cancel',
    '/temporary-access/request',
  ];

  // Se for uma rota pública, permitir acesso
  const isPublicRoute = publicRoutes.some(route => {
    if (route === '/') {
      return to.path === '/';
    }
    return to.path.startsWith(route);
  });

  if (isPublicRoute) {
    return;
  }

  // Para todas as rotas protegidas, verificar assinatura
  try {
    const status = await $fetch('/api/stripe/subscription-status', {
      headers: useRequestHeaders(['cookie']),
    });

    // Se não tem acesso, redirecionar para página de profile na aba subscription
    if (!status?.hasAccess) {
      return navigateTo('/profile?tab=subscription');
    }
  } catch (error: any) {
    console.error('Error in subscription middleware:', error);
    
    // Se o erro for 401 (não autenticado), deixar o middleware de auth lidar
    if (error.statusCode === 401) {
      return;
    }

    // Em caso de outros erros, permitir acesso temporariamente
    // (pode ser um problema de conectividade)
    return;
  }
});

