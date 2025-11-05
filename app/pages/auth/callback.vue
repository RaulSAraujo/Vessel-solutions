<script setup lang="ts">
import { useSubscriptionApi } from '~/composables/api/useSubscriptionApi';

definePageMeta({
  layout: 'default',
  middleware: ['auth'], // Apenas verificar autenticação
});

// Esta página é chamada após login bem-sucedido (email/senha ou OAuth)
// O Supabase redireciona automaticamente para aqui após autenticação
// Verifica status da assinatura e redireciona adequadamente

const { checkSubscriptionStatus, loading } = useSubscriptionApi();
const redirecting = ref(false);

onMounted(async () => {
  if (redirecting.value) return;
  
  const user = useSupabaseUser();
  
  // Aguardar um pouco para garantir que o usuário está carregado
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (!user.value) {
    redirecting.value = true;
    await navigateTo('/auth/login');
    return;
  }

  try {
    redirecting.value = true;
    const status = await checkSubscriptionStatus();
    
    // Se não tem acesso, redirecionar para página de profile na aba subscription
    if (!status?.hasAccess) {
      await navigateTo('/profile?tab=subscription');
    } else {
      // Se tem acesso, ir para dashboard
      await navigateTo('/dashboard');
    }
  } catch (error) {
    console.error('Error checking subscription in callback:', error);
    // Em caso de erro, ir para profile na aba subscription (mais seguro)
    redirecting.value = true;
    await navigateTo('/profile?tab=subscription');
  }
});
</script>

<template>
  <v-container>
    <v-row justify="center" align="center" style="min-height: 50vh">
      <v-col cols="12" md="6" class="text-center">
        <v-progress-circular 
          indeterminate 
          color="primary" 
          size="64" 
          class="mb-4"
          :loading="loading || redirecting"
        />
        <p class="text-body-1">Verificando sua assinatura...</p>
      </v-col>
    </v-row>
  </v-container>
</template>

