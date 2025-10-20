<script lang="ts" setup>
import { useEventQuotationsApi } from "~/composables/api/useEventQuotationsApi";
import type {
  Datum as Client,
  FormClient,
  FormClientAddresses,
} from "~/types/clients";
// components
import Revision from "./Revision.vue";
import FindClient from "./FindClient.vue";

const emit = defineEmits(["close"]);

const store = useEventQuotationsStore();
const { selectedEventQuotation } = storeToRefs(store);

const api = useEventQuotationsApi();

const step = ref<1 | 2>(1);
const converting = ref(false);
const forceReload = ref(true);
const client = ref<string | Client | null>(null);

watch(
  () => client.value,
  () => {
    if (typeof client.value == "object") {
      forceReload.value = false;

      setTimeout(() => {
        forceReload.value = true;
      }, 500);
    }
  }
);

async function handleConvert(payload?: FormClient & FormClientAddresses) {
  try {
    if (!selectedEventQuotation.value) return;

    converting.value = true;

    await api.convertToEvent(selectedEventQuotation.value.id, payload);

    $toast().success("Cotação convertida em evento com sucesso.");

    emit("close");
  } finally {
    converting.value = false;
  }
}

function reset() {
  step.value = 1;
  client.value = null;
}
</script>

<template>
  <v-bottom-sheet content-class="rounded-xl" @update:model-value="reset">
    <v-toolbar color="primary" rounded="t-xl">
      <v-toolbar-title>
        <v-icon icon="mdi-calendar-plus" class="mr-2" />
        Converter Cotação para Evento
      </v-toolbar-title>
    </v-toolbar>

    <v-stepper
      v-model="step"
      elevation="0"
      :editable="true"
      :hide-actions="step === 2"
    >
      <v-stepper-item
        :value="1"
        title="Revisar conversão"
        :complete="step > 1"
      />
      <v-stepper-item :value="2" title="Informações do cliente" />

      <v-stepper-window>
        <v-stepper-window-item :value="1">
          <Revision />
        </v-stepper-window-item>

        <v-stepper-window-item :value="2">
          <span class="text-h6 text-primary">Buscar cliente</span>

          <FindClient v-model="client" class="mt-2" />

          <v-divider class="my-5" />

          <span class="text-h6 text-primary">Informações do cliente</span>

          <ClientsForm
            v-if="forceReload"
            class="mt-2"
            :client="typeof client === 'object' ? client : null"
            :loading="converting"
            @submit="handleConvert"
          />

          <div
            v-else
            class="d-flex justify-center align-center"
            style="min-height: 280px"
          >
            <v-progress-circular indeterminate size="64" />
          </div>
        </v-stepper-window-item>
      </v-stepper-window>

      <v-stepper-actions>
        <template #prev>
          <v-btn
            v-if="step === 1"
            variant="text"
            color="grey"
            :disabled="false"
            @click="$emit('close')"
          >
            Cancelar
          </v-btn>
        </template>

        <template #next>
          <v-btn
            v-if="step === 1"
            rounded="lg"
            color="primary"
            @click="step = 2"
          >
            Continuar
          </v-btn>
        </template>
      </v-stepper-actions>
    </v-stepper>
  </v-bottom-sheet>
</template>
