<script lang="ts" setup>
import { useIngredientsApi } from "~/composables/api/useIngredientsApi";

import type { Datum } from "~/types/quotations";

const emit = defineEmits(["close"]);

const api = useIngredientsApi();

const store = useQuotationsStore();
const { selectedQuotation } = storeToRefs(store);

const linking = ref(false);

async function linkToIngredient() {
  if (!selectedQuotation.value?.ingredient_id) {
    emit("close");
    return;
  }

  linking.value = true;

  // Buscar o ingrediente pelo ID
  const ingredient = await api.getIngredientById(selectedQuotation.value?.ingredient_id);

  if (!ingredient) {
    linking.value = false;
    return;
  }

  // Vincular a cotação ao ingrediente
  const updatedIngredient = await api.setQuotationForIngredient(
    ingredient,
    selectedQuotation.value
  );

  if (updatedIngredient) {
    $toast().success("Cotação vinculada ao ingrediente com sucesso!");
  }

  linking.value = false;

  emit("close");
}

function skipLinking() {
  emit("close");
}
</script>

<template>
  <v-dialog width="400" persistent>
    <v-card title="Vincular Cotação" rounded="xl">
      <v-card-text>
        <p class="text-body-1 mb-4">
          Deseja vincular esta nova cotação ao ingrediente
          <strong>{{ selectedQuotation?.ingredients?.name }}</strong
          >?
        </p>
        <p class="text-body-2 text-medium-emphasis">
          Ao vincular, esta cotação será definida como a cotação atual do
          ingrediente.
        </p>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="grey"
          variant="text"
          :disabled="linking"
          @click="skipLinking"
        >
          Não vincular
        </v-btn>
        <v-btn color="primary" :loading="linking" @click="linkToIngredient">
          Sim, vincular
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
