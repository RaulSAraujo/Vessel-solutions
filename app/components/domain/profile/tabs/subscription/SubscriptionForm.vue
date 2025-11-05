<script setup lang="ts">
import type { SubscriptionStatus } from '~/composables/api/useSubscriptionApi';

interface Props {
  status: SubscriptionStatus | null;
  loading?: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  subscribe: [];
}>();
</script>

<template>
  <div>
    <div v-if="!status?.hasActiveSubscription">
      <v-alert type="info" variant="tonal" class="mb-6">
        <v-alert-title class="text-h6 mb-2">Plano Mensal</v-alert-title>
        <p class="mb-2">
          Assine agora e tenha acesso completo à plataforma Vessel.
        </p>
        <p class="mb-0 text-h5 font-weight-bold text-primary">
          R$ 99/mês
        </p>
      </v-alert>

      <v-card class="mb-6 border-sm rounded-lg">
        <v-card-text>
          <h4 class="text-subtitle-1 mb-3">O que você recebe:</h4>
          <v-list density="compact">
            <v-list-item>
              <template #prepend>
                <v-icon color="success" size="small">mdi-check-circle</v-icon>
              </template>
              <v-list-item-title class="text-body-2">Gestão completa de eventos</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <template #prepend>
                <v-icon color="success" size="small">mdi-check-circle</v-icon>
              </template>
              <v-list-item-title class="text-body-2">Controle de ingredientes e custos</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <template #prepend>
                <v-icon color="success" size="small">mdi-check-circle</v-icon>
              </template>
              <v-list-item-title class="text-body-2">Análise de lucratividade</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <template #prepend>
                <v-icon color="success" size="small">mdi-check-circle</v-icon>
              </template>
              <v-list-item-title class="text-body-2">Suporte técnico dedicado</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>

      <v-btn
        color="primary"
        size="large"
        variant="elevated"
        block
        prepend-icon="mdi-credit-card"
        :loading="loading"
        @click="emit('subscribe')"
      >
        Assinar Agora
      </v-btn>
    </div>
  </div>
</template>

