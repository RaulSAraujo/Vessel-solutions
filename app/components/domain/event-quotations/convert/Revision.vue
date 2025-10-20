<script lang="ts" setup>
const store = useEventQuotationsStore();
const { selectedEventQuotation } = storeToRefs(store);
</script>

<template>
  <div>
    <p class="text-body-1 mb-4">Revise os detalhes antes da conversão.</p>

    <div v-if="selectedEventQuotation" class="pa-4 rounded">
      <h4 class="text-subtitle-1 mb-2">Detalhes da Cotação:</h4>
      <p>
        <strong>Cliente:</strong>
        {{ selectedEventQuotation.client_name }}
      </p>
      <p>
        <strong>Local:</strong>
        {{ selectedEventQuotation.location }}
      </p>
      <p>
        <strong>Data/Hora:</strong>
        {{ formatDate(selectedEventQuotation.start_time, "DD/MM HH:mm") }}
        -
        {{ formatDate(selectedEventQuotation.end_time, "DD/MM HH:mm") }}
      </p>
      <p>
        <strong>Convidados:</strong>
        {{ selectedEventQuotation.guest_count }}
      </p>
      <p>
        <strong>Valor Total:</strong>
        {{ formatCurrency(selectedEventQuotation.total_revenue) }}
      </p>
    </div>

    <v-alert type="info" variant="tonal" rounded="lg" class="mt-4">
      <template #prepend>
        <v-icon icon="mdi-information" />
      </template>
      <div>
        <p class="mb-1"><strong>O que acontecerá:</strong></p>
        <ul class="mb-0">
          <li>Um cliente será criado/atualizado</li>
          <li>Um novo evento será criado com os dados da cotação</li>
          <li>Os drinks serão transferidos para o evento</li>
          <li>Status da cotação será "convertido"</li>
        </ul>
      </div>
    </v-alert>
  </div>
</template>
