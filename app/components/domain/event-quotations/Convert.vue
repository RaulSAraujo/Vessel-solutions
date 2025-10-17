<script lang="ts" setup>
const emit = defineEmits(["close", "open-form"]);

const store = useEventQuotationsStore();
const { selectedEventQuotation } = storeToRefs(store);

function handleConvert() {
  if (!selectedEventQuotation.value) return;

  emit("open-form");
  emit("close");
}
</script>

<template>
  <v-dialog max-width="550" persistent content-class="rounded-xl">
    <v-card rounded="xl" class="pa-2">
      <v-card-title class="text-h5 d-flex align-center">
        <v-icon icon="mdi-calendar-plus" class="mr-2" />
        Converter Cotação para Evento
      </v-card-title>

      <v-card-text>
        <p class="text-body-1 mb-4">
          Tem certeza que deseja converter esta cotação em um evento?
        </p>

        <div
          v-if="selectedEventQuotation"
          class="bg-grey-lighten-5 pa-4 rounded"
        >
          <h4 class="text-subtitle-1 mb-2">Detalhes da Cotação:</h4>
          <p>
            <strong>Cliente:</strong> {{ selectedEventQuotation.client_name }}
          </p>
          <p><strong>Local:</strong> {{ selectedEventQuotation.location }}</p>
          <p>
            <strong>Data/Hora:</strong>
            {{ formatDate(selectedEventQuotation.start_time) }}
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
              <li>Um novo cliente será criado (se não existir)</li>
              <li>Um novo evento será criado com os dados da cotação</li>
              <li>Os drinks da cotação serão transferidos para o evento</li>
              <li>O status da cotação será alterado para "convertido"</li>
            </ul>
          </div>
        </v-alert>
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn color="grey" variant="text" @click="$emit('close')">
          Cancelar
        </v-btn>

        <v-btn
          color="success"
          variant="flat"
          class="text-white px-4"
          @click="handleConvert"
        >
          <v-icon start icon="mdi-calendar-plus" />
          Converter
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
