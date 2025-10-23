<script lang="ts" setup>
import { usePurchaseListApi } from "~/composables/api/usePurchaseListApi";

const emit = defineEmits(["close"]);

const api = usePurchaseListApi();

const store = usePurchaseListStore();
const { selectedItems } = storeToRefs(store);

const loading = ref(false);
const action = ref<"updateStatus" | null>(null);
const newStatus = ref<"pending" | "purchased" | "cancelled">("pending");

function close() {
  action.value = null;
  newStatus.value = "pending";
  emit("close");
}

async function executeAction() {
  if (!action.value) return;

  loading.value = true;
  try {
    if (action.value === "updateStatus") {
      // Atualizar status dos itens selecionados
      if (selectedItems.value.length === 0) {
        $toast().warning("Nenhum item selecionado");
        return;
      }

      const updatePromises = selectedItems.value.map((item) =>
        api.updatePurchaseListItem(item.id, { status: newStatus.value })
      );

      const responses = await Promise.all(updatePromises);

      $toast().success(
        `Status de ${selectedItems.value.length} item(ns) atualizado(s) para ${newStatus.value}`
      );

      if (!responses) return;

      // Atualizar os itens na store
      for (const item of responses) {
        if (!item) continue;

        store.updateItem(item);
      }

      store.fetchSummary();

      selectedItems.value = [];

      close();
    }
  } catch (error) {
    console.error("Erro ao executar ação em lote:", error);
    $toast().error("Erro ao atualizar status dos itens");
  } finally {
    loading.value = false;
  }
}

function getStatusText(status: string) {
  switch (status) {
    case "pending":
      return "Pendente";
    case "purchased":
      return "Comprado";
    case "cancelled":
      return "Cancelado";
    default:
      return status;
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "pending":
      return "warning";
    case "purchased":
      return "success";
    case "cancelled":
      return "error";
    default:
      return "grey";
  }
}
</script>

<template>
  <v-bottom-sheet content-class="rounded-t-xl">
    <v-card
      rounded="t-xl"
      title="Ações em Lote"
      prepend-icon="mdi-checkbox-multiple-marked"
    >
      <v-divider />

      <v-card-text>
        <div class="text-body-1 mb-4">
          Você selecionou <strong>{{ selectedItems.length }}</strong> item(ns)
          para ação em lote.
        </div>

        <!-- Lista dos itens selecionados -->
        <v-card rounded="lg" class="mb-4 border-sm">
          <v-card-title class="text-subtitle-1">
            Itens Selecionados
          </v-card-title>

          <v-card-text>
            <v-list density="compact">
              <v-list-item
                v-for="item in selectedItems.slice(0, 5)"
                :key="item.id"
                class="px-0"
              >
                <template #prepend>
                  <v-icon icon="mdi-food-variant" />
                </template>

                <v-list-item-title>
                  {{ item.ingredients.name }}
                </v-list-item-title>

                <v-list-item-subtitle>
                  {{ item.events.location }} -
                  {{ item.quantity_needed.toFixed(3) }}
                  {{ item.units.abbreviation }}
                </v-list-item-subtitle>

                <template #append>
                  <v-chip
                    :color="getStatusColor(item.status)"
                    size="small"
                    variant="flat"
                    class="text-white"
                  >
                    {{ getStatusText(item.status) }}
                  </v-chip>
                </template>
              </v-list-item>

              <v-list-item v-if="selectedItems.length > 5" class="px-0">
                <v-list-item-title class="text-grey">
                  ... e mais {{ selectedItems.length - 5 }} item(ns)
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>

        <!-- Seleção da ação -->
        <div class="text-subtitle-1 mb-3">Ação disponível:</div>

        <v-radio-group v-model="action" class="mb-4">
          <v-radio value="updateStatus" label="Atualizar Status" />
        </v-radio-group>

        <!-- Seleção do novo status -->
        <div v-if="action === 'updateStatus'" class="mb-4">
          <div class="text-subtitle-1 mb-3">Novo Status:</div>
          <v-radio-group v-model="newStatus">
            <v-radio value="pending" label="Pendente" color="warning" />
            <v-radio value="purchased" label="Comprado" color="success" />
            <v-radio value="cancelled" label="Cancelado" color="error" />
          </v-radio-group>
        </div>

        <!-- Aviso para atualização de status -->
        <v-alert
          v-if="action === 'updateStatus'"
          type="info"
          variant="tonal"
          class="mb-4"
        >
          <v-icon class="mr-2" icon="mdi-information" />
          <strong>Informação:</strong> O status de
          {{ selectedItems.length }} item(ns) será alterado para
          <strong>{{ getStatusText(newStatus) }}</strong
          >.
        </v-alert>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn color="grey" variant="text" @click="close"> Cancelar </v-btn>
        <v-btn
          color="primary"
          :loading="loading"
          :disabled="!action"
          @click="executeAction"
        >
          Atualizar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-bottom-sheet>
</template>
