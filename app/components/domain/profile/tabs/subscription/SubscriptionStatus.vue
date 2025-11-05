<script setup lang="ts">
import type { SubscriptionStatus } from '~/composables/api/useSubscriptionApi';
import TemporaryAccessTimer from './TemporaryAccessTimer.vue';

const dayjs = useDayjs();

interface Props {
  status: SubscriptionStatus | null;
  loading?: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  cancel: [];
  resume: [];
}>();

const formatDate = (date: string | null, includeTime = false) => {
  if (!date) return '-';
  if (includeTime) {
    return dayjs(date).format('DD/MM/YYYY [às] HH:mm');
  }
  return dayjs(date).format('DD/MM/YYYY');
};
</script>

<template>
  <div>
    <div v-if="loading && !status" class="text-center pa-8">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <div v-else-if="status?.hasAccess">
      <div v-if="status.hasActiveSubscription">
        <h3 class="text-h6 mb-4">Detalhes da Assinatura</h3>
        <v-list density="comfortable" class="mb-4">
          <v-list-item>
            <template #prepend>
              <v-icon>mdi-information</v-icon>
            </template>
            <v-list-item-title>Status</v-list-item-title>
            <template #append>
              <v-chip
                :color="status.subscription?.status === 'active' ? 'success' : 'warning'"
                size="small"
                variant="flat"
              >
                {{ status.subscription?.status === 'active' ? 'Ativa' : status.subscription?.status }}
              </v-chip>
            </template>
          </v-list-item>

          <v-list-item>
            <template #prepend>
              <v-icon>mdi-calendar</v-icon>
            </template>
            <v-list-item-title>Próximo pagamento</v-list-item-title>
            <template #append>
              <span class="text-body-2 font-weight-medium">
                {{ formatDate(status.subscription?.currentPeriodEnd ?? null) }}
              </span>
            </template>
          </v-list-item>

          <v-list-item v-if="status.subscription?.cancelAtPeriodEnd">
            <template #prepend>
              <v-icon color="warning">mdi-alert</v-icon>
            </template>
            <v-list-item-title>Cancelamento</v-list-item-title>
            <template #append>
              <v-chip color="warning" size="small" variant="flat">
                Será cancelada ao final do período
              </v-chip>
            </template>
          </v-list-item>
        </v-list>

        <div class="d-flex ga-2">
          <v-btn
            v-if="!status.subscription?.cancelAtPeriodEnd"
            color="error"
            variant="outlined"
            prepend-icon="mdi-cancel"
            @click="emit('cancel')"
          >
            Cancelar Assinatura
          </v-btn>
          <v-btn
            v-else
            color="success"
            variant="elevated"
            prepend-icon="mdi-restore"
            @click="emit('resume')"
          >
            Retomar Assinatura
          </v-btn>
        </div>
      </div>

      <div v-else-if="status.hasTemporaryAccess">
        <h3 class="text-h6 mb-4">Acesso Temporário</h3>
        
        <!-- Timer de contagem regressiva -->
        <v-card 
          v-if="status.temporaryAccess?.expiresAt"
          variant="tonal"
          :color="status.temporaryAccess?.expiresAt ? 'warning' : 'error'"
          class="mb-4"
        >
          <v-card-text class="py-3">
            <TemporaryAccessTimer :expires-at="status.temporaryAccess.expiresAt" />
          </v-card-text>
        </v-card>

        <v-list density="comfortable">
          <v-list-item v-if="status.temporaryAccess?.startsAt">
            <template #prepend>
              <v-icon>mdi-calendar-start</v-icon>
            </template>
            <v-list-item-title>Início</v-list-item-title>
            <template #append>
              <span class="text-body-2 font-weight-medium">
                {{ formatDate(status.temporaryAccess.startsAt, true) }}
              </span>
            </template>
          </v-list-item>
          <v-list-item>
            <template #prepend>
              <v-icon>mdi-calendar-clock</v-icon>
            </template>
            <v-list-item-title>Válido até</v-list-item-title>
            <template #append>
              <span class="text-body-2 font-weight-medium">
                {{ formatDate(status.temporaryAccess?.expiresAt ?? null, true) }}
              </span>
            </template>
          </v-list-item>
          <v-list-item v-if="status.temporaryAccess?.reason">
            <template #prepend>
              <v-icon>mdi-note-text</v-icon>
            </template>
            <v-list-item-title>Motivo</v-list-item-title>
            <template #append>
              <span class="text-body-2">
                {{ status.temporaryAccess.reason }}
              </span>
            </template>
          </v-list-item>
        </v-list>
      </div>
    </div>

    <div v-else class="text-center pa-8">
      <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-lock</v-icon>
      <h3 class="text-h6 mb-2">Você não tem acesso à plataforma</h3>
      <p class="text-body-2 text-medium-emphasis mb-4">
        Escolha uma das opções ao lado para obter acesso
      </p>
    </div>
  </div>
</template>

