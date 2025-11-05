<script setup lang="ts">
const dayjs = useDayjs();
const user = useSupabaseUser();

// Usar composable global para verificar status de acesso temporário
const { status } = useGlobalSubscriptionRealtime({
  onlyHasAccess: false,
  autoStart: true,
});

// Estado para controlar se o usuário fechou o aviso manualmente
const userDismissed = ref(false);

// Usar VueUse para obter o tempo atual reativo (atualiza a cada segundo)
const now = useNow({ interval: 1000 });

// Obter a data de expiração
const expiresAt = computed(() => {
  const subscriptionStatus = status.value;
  
  if (!subscriptionStatus || typeof subscriptionStatus === 'boolean') {
    return null;
  }

  if (!subscriptionStatus.temporaryAccess?.expiresAt) {
    return null;
  }

  return dayjs(subscriptionStatus.temporaryAccess.expiresAt).toDate();
});

// Calcular tempo restante em milissegundos
const timeRemaining = computed(() => {
  if (!expiresAt.value) {
    return 0;
  }

  const diff = expiresAt.value.getTime() - now.value.getTime();
  return diff > 0 ? diff : 0;
});

// Formatar tempo restante mostrando dias, horas, minutos e segundos
const formattedTimeRemaining = computed(() => {
  if (!expiresAt.value || timeRemaining.value <= 0) {
    return 'Expirado';
  }

  const totalSeconds = Math.floor(timeRemaining.value / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];
  
  if (days > 0) {
    parts.push(`${days}d`);
  }
  
  if (hours > 0 || days > 0) {
    parts.push(`${hours}h`);
  }
  
  if (minutes > 0 || hours > 0 || days > 0) {
    parts.push(`${minutes}m`);
  }
  
  // Sempre mostrar segundos
  parts.push(`${seconds}s`);

  return parts.join(' ');
});

const shouldShowWarning = computed(() => {
  // Não mostrar se não estiver autenticado
  if (!user.value) {
    return false;
  }

  if (userDismissed.value) {
    return false;
  }

  const subscriptionStatus = status.value;
  
  if (!subscriptionStatus || typeof subscriptionStatus === 'boolean') {
    return false;
  }

  // Mostrar apenas se tiver acesso temporário ativo
  if (!subscriptionStatus.hasTemporaryAccess || !subscriptionStatus.temporaryAccess?.expiresAt) {
    return false;
  }

  // Mostrar aviso se faltar menos de 24 horas e ainda não expirou
  if (timeRemaining.value <= 0) {
    return false; // Já expirou
  }

  const hoursRemaining = timeRemaining.value / (1000 * 60 * 60);
  return hoursRemaining > 0 && hoursRemaining <= 24;
});

const isUrgent = computed(() => {
  // Urgente se faltar menos de 1 hora
  return timeRemaining.value > 0 && timeRemaining.value <= 60 * 60 * 1000;
});

const route = useRoute();

// Não mostrar na página de profile (já tem aviso lá) ou em páginas de auth
const shouldHide = computed(() => {
  return route.path === '/profile' || 
         route.path.startsWith('/auth') || 
         route.path === '/' ||
         route.path.startsWith('/subscription');
});

// Resetar dismissed quando o status mudar (novo acesso temporário concedido)
watch(() => {
  const statusValue = status.value;
  if (statusValue && typeof statusValue !== 'boolean') {
    return statusValue.hasTemporaryAccess;
  }
  return false;
}, (hasTemporaryAccess) => {
  if (hasTemporaryAccess) {
    userDismissed.value = false;
  }
});

// Redirecionar quando expirar
watch(timeRemaining, (remaining) => {
  if (remaining <= 0 && expiresAt.value) {
    // Redirecionar quando expirar (se não estiver em rota pública)
    const publicRoutes = ['/', '/auth/login', '/auth/register', '/auth/callback', '/profile', '/subscription/success', '/subscription/cancel'];
    const isPublicRoute = publicRoutes.some(routePath => route.path === routePath || route.path.startsWith(routePath));
    
    if (!isPublicRoute && user.value) {
      navigateTo('/profile?tab=subscription');
    }
  }
});
</script>

<template>
  <v-snackbar
    v-model="shouldShowWarning"
    v-if="!shouldHide"
    :color="isUrgent ? 'error' : 'warning'"
    :timeout="-1"
    location="top"
    variant="elevated"
    class="temporary-access-warning"
  >
    <div class="d-flex align-center ga-3">
      <v-icon :icon="isUrgent ? 'mdi-alert-circle' : 'mdi-clock-alert-outline'" size="24" />
      <div class="flex-grow-1">
        <div class="text-body-1 font-weight-bold">
          {{ isUrgent ? 'Atenção: Seu acesso temporário está expirando!' : 'Aviso: Seu acesso temporário está próximo de expirar' }}
        </div>
        <div class="text-body-2 mt-1">
          {{ isUrgent ? `Faltam apenas ${formattedTimeRemaining} para expirar` : `Faltam ${formattedTimeRemaining} para expirar` }}
        </div>
      </div>
      <v-btn
        variant="text"
        color="white"
        size="small"
        prepend-icon="mdi-credit-card"
        @click="navigateTo('/profile?tab=subscription')"
      >
        Renovar
      </v-btn>
      <v-btn
        icon="mdi-close"
        variant="text"
        size="small"
        @click="userDismissed = true"
      />
    </div>
  </v-snackbar>
</template>

<style scoped>
.temporary-access-warning {
  z-index: 9999;
}
</style>

