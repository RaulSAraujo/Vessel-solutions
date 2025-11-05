export default defineNuxtRouteMiddleware(async (to) => {
    const user = useSupabaseUser();
    const supabase = useSupabaseClient();

    // Rotas públicas que não exigem autenticação
    const publicRoutes = ['/', '/auth/login', '/auth/register', '/auth/callback', '/subscription/success', '/subscription/cancel', '/temporary-access/request'];
    
    // Rotas de autenticação (login e registro)
    const authRoutes = ['/auth/login', '/auth/register'];
    
    // Verifica se a rota atual é pública
    const isPublicRoute = publicRoutes.includes(to.path);
    
    // Aguarda o carregamento do usuário (máximo 250ms)
    // Isso evita redirecionamentos incorretos enquanto o Supabase está verificando a sessão
    if (process.client && user.value === null) {
        try {
            // Verifica a sessão diretamente primeiro (mais rápido)
            const { data: { session } } = await supabase.auth.getSession();
            
            if (session) {
                // Se existe sessão, aguarda até o user.value ser atualizado (máximo 200ms)
                let attempts = 0;
                const maxAttempts = 8; // 8 tentativas x 25ms = 200ms
                
                while (user.value === null && attempts < maxAttempts) {
                    await new Promise(resolve => setTimeout(resolve, 25));
                    attempts++;
                }
            } else {
                // Se não há sessão, aguarda um pouco para garantir que não há sessão pendente
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        } catch (error) {
            // Em caso de erro, continua normalmente após um pequeno delay
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
    
    // Se o usuário está logado
    if (user.value) {
        // Se tentar acessar rota de autenticação, redirecionar para dashboard
        // Usuário já autenticado não precisa ver páginas de login/registro
        if (authRoutes.includes(to.path)) {
            return navigateTo('/dashboard');
        }
        // Se tentar acessar landing page, verificar assinatura e redirecionar
        if (to.path === '/') {
            // Deixar o middleware subscription verificar e redirecionar adequadamente
            return;
        }
    } else {
        // Se o usuário NÃO está logado e tenta acessar uma rota protegida
        if (!isPublicRoute) {
            return navigateTo('/auth/login');
        }
    }
});