<script setup lang="ts">
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";

definePageMeta({
  middleware: ["auth"],
});

const filterDrawer = ref(false);
const dialogBulkActions = ref(false);

// Usar store diretamente
const store = usePurchaseListStore();
const { summary } = storeToRefs(store);

// Carregar dados iniciais
onMounted(async () => {
  await store.fetchSummary();
});
</script>

<template>
  <v-container fluid>
    <div id="tutorial-purchase-list-header" class="d-flex flex-row align-center mb-4 text-primary">
      <v-icon size="28" class="mr-2" icon="mdi-cart" />
      <span class="text-h5">Lista de Compras</span>
    </div>

    <!-- Informação sobre geração automática -->
    <v-alert id="tutorial-purchase-list-info" type="info" variant="tonal" class="mb-4">
      <strong>Informação:</strong> Os itens da lista de compras são
      gerados/atualizados automaticamente quando um evento é alterado para
      status "Comprar". Você pode apenas alterar o status dos itens (Pendente,
      Comprado, Cancelado).
    </v-alert>

    <!-- Resumo -->
    <div id="tutorial-purchase-list-summary">
    <PurchaseListSummary v-if="summary" :summary="summary" class="mb-4" />
    </div>

    <!-- Filtros -->
    <PurchaseListFilter v-model="filterDrawer" />

    <!-- Tabela -->
    <div id="tutorial-purchase-list-table">
    <PurchaseListTable
      @open-filter="filterDrawer = true"
      @open-bulk-actions="dialogBulkActions = true"
    />
    </div>

    <!-- Diálogos -->
    <PurchaseListBulkActions
      v-model="dialogBulkActions"
      @close="dialogBulkActions = false"
    />
  </v-container>
</template>
