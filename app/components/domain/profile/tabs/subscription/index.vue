<script setup lang="ts">
import { useSubscriptionApi, type SubscriptionStatus } from '~/composables/api/useSubscriptionApi';
import SubscriptionStatusComponent from './SubscriptionStatus.vue';
import SubscriptionForm from './SubscriptionForm.vue';
import TemporaryAccessForm from './TemporaryAccessForm.vue';
import TemporaryAccessTimer from './TemporaryAccessTimer.vue';

const route = useRoute();
const { 
  createCheckout, 
  cancelSubscription, 
  resumeSubscription, 
  requestTemporaryAccess,
  loading,
  errorMessage 
} = useSubscriptionApi();

const config = useRuntimeConfig();
const priceId = ref(config.public.stripePriceId || 'price_1SPqCbRqS0dsHWTKABXy1sHt');
const showTemporaryForm = ref(false);

// Usar composable global otimizado para gerenciar atualização em tempo real do status
// onlyHasAccess: false porque precisamos do status completo
const { status, loadStatus } = useGlobalSubscriptionRealtime({
  onlyHasAccess: false,
  autoStart: true,
  onStatusChange: (newStatus) => {
    // Se vier da landing page com tab=temporary, mostrar formulário
    if (route.query.tab === 'temporary') {
      showTemporaryForm.value = true;
    }
  },
});

// Converter para SubscriptionStatus | null
const subscriptionStatus = computed(() => {
  const s = status.value;
  return (typeof s === 'boolean' ? null : s) as SubscriptionStatus | null;
});

// Observar mudanças na query string
watch(() => route.query.tab, (newTab) => {
  if (newTab === 'temporary') {
    showTemporaryForm.value = true;
  }
});

const handleSubscribe = async () => {
  const result = await createCheckout(priceId.value);
  
  if (result?.url) {
    window.location.href = result.url;
  } else {
    $toast().error('Erro ao processar pagamento. Tente novamente.');
  }
};

const handleCancel = async () => {
  const confirmed = confirm('Tem certeza que deseja cancelar sua assinatura? Ela continuará ativa até o final do período atual.');
  if (confirmed) {
    const success = await cancelSubscription();
    if (success) {
      $toast().success('Assinatura será cancelada ao final do período atual.');
      await loadStatus();
    } else {
      $toast().error('Erro ao cancelar assinatura.');
    }
  }
};

const handleResume = async () => {
  const success = await resumeSubscription();
  if (success) {
    $toast().success('Assinatura retomada com sucesso!');
    await loadStatus();
  } else {
    $toast().error('Erro ao retomar assinatura.');
  }
};

const handleTemporaryAccessSubmit = async (reason: string, contactInfo: string) => {
  const success = await requestTemporaryAccess(reason, contactInfo);
  
  if (success) {
    $toast().success('Solicitação enviada com sucesso! Entraremos em contato em breve.');
    await loadStatus();
    showTemporaryForm.value = false;
  } else {
    $toast().error(errorMessage.value || 'Erro ao enviar solicitação.');
  }
};
</script>

<template>
  <v-tabs-window-item value="subscription">
    <div class="pa-6">
      <div v-if="loading && !subscriptionStatus" class="text-center pa-8">
        <v-progress-circular indeterminate color="primary" />
      </div>

      <div v-else>
        <!-- Status de acesso atual -->
        <div v-if="subscriptionStatus?.hasAccess" class="mb-6">
          <v-alert type="success" variant="tonal" density="compact">
            <div class="d-flex align-center justify-space-between">
              <div>
                <v-alert-title class="text-body-1 font-weight-bold">Você tem acesso à plataforma</v-alert-title>
                <div v-if="subscriptionStatus.hasActiveSubscription && subscriptionStatus.subscription?.currentPeriodEnd" class="text-caption mt-1">
                  Assinatura ativa até {{ $dayjs(subscriptionStatus.subscription.currentPeriodEnd).format('DD/MM/YYYY') }}
                </div>
                <div v-else-if="subscriptionStatus.hasTemporaryAccess && subscriptionStatus.temporaryAccess?.expiresAt" class="text-caption mt-1">
                  <div class="d-flex align-center flex-wrap ga-2">
                    <span>Acesso temporário válido até {{ $dayjs(subscriptionStatus.temporaryAccess.expiresAt).format('DD/MM/YYYY [às] HH:mm') }}</span>
                    <v-divider vertical class="mx-1" />
                    <TemporaryAccessTimer :expires-at="subscriptionStatus.temporaryAccess.expiresAt" />
                  </div>
                </div>
              </div>
              <v-chip color="success" size="small" variant="flat">
                Ativo
              </v-chip>
            </div>
          </v-alert>
        </div>

        <!-- Conteúdo principal -->
        <v-row>
          <!-- Coluna esquerda: Status/Gerenciamento -->
          <v-col cols="12" md="6">
            <v-card class="h-100 border-sm rounded-lg">
              <v-card-title class="d-flex align-center">
                <v-icon class="mr-2">mdi-information</v-icon>
                Status da Assinatura
              </v-card-title>

              <v-card-text>
                <SubscriptionStatusComponent
                  :status="subscriptionStatus"
                  :loading="loading"
                  @cancel="handleCancel"
                  @resume="handleResume"
                />
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Coluna direita: Opções de Acesso -->
          <v-col cols="12" md="6">
            <!-- Se não tem acesso, mostrar opções -->
            <div v-if="!subscriptionStatus?.hasAccess">
              <!-- Assinatura -->
              <v-card class="mb-4 border-sm rounded-lg">
                <v-card-title class="d-flex align-center">
                  <v-icon class="mr-2">mdi-credit-card</v-icon>
                  Assinatura Mensal
                </v-card-title>
                <v-card-text>
                  <SubscriptionForm
                    :status="subscriptionStatus"
                    :loading="loading"
                    @subscribe="handleSubscribe"
                  />
                </v-card-text>
              </v-card>

              <!-- Acesso Temporário -->
              <v-card class="border-sm rounded-lg">
                <v-card-title class="d-flex align-center">
                  <v-icon class="mr-2">mdi-clock-outline</v-icon>
                  Acesso Temporário
                </v-card-title>
                <v-card-text>
                  <TemporaryAccessForm
                    v-if="showTemporaryForm"
                    :status="subscriptionStatus"
                    :loading="loading"
                    :error-message="errorMessage"
                    @submit="handleTemporaryAccessSubmit"
                  />
                  <div v-else>
                    <v-alert type="info" variant="tonal" class="mb-4">
                      <v-alert-title>O que é acesso temporário?</v-alert-title>
                      <p class="mb-4 text-body-2">
                        O acesso temporário é ideal para eventos pontuais ou para avaliação da plataforma. 
                        Entre em contato conosco e nossa equipe avaliará sua solicitação.
                      </p>
                    </v-alert>
                    <v-btn
                      color="primary"
                      variant="outlined"
                      block
                      prepend-icon="mdi-clock-outline"
                      @click="showTemporaryForm = true"
                    >
                      Solicitar Acesso Temporário
                    </v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </div>

            <!-- Se tem acesso, mostrar informações adicionais -->
            <div v-else>
              <v-card class="border-sm rounded-lg">
                <v-card-title class="d-flex align-center">
                  <v-icon class="mr-2">mdi-help-circle</v-icon>
                  Precisa de ajuda?
                </v-card-title>
                <v-card-text>
                  <p class="text-body-2 mb-4">
                    Se você tiver dúvidas sobre sua assinatura ou precisar de suporte, 
                    entre em contato conosco.
                  </p>
                  <v-btn
                    color="primary"
                    variant="outlined"
                    block
                    prepend-icon="mdi-email"
                  >
                    Entrar em Contato
                  </v-btn>
                </v-card-text>
              </v-card>
            </div>
          </v-col>
        </v-row>
      </div>
    </div>
  </v-tabs-window-item>
</template>

