<script lang="ts" setup>
defineEmits(["openFilter", "openBulkActions"]);

// Usar store diretamente
const store = usePurchaseListStore();
const { items, loading, selectedItems, page, itemsPerPage, totalItems } =
  storeToRefs(store);

const headers = [
  { title: "Evento", key: "events.location", minWidth: 200 },
  { title: "Data do Evento", key: "events.start_time", minWidth: 150 },
  { title: "Cliente", key: "events.clients.name", minWidth: 150 },
  { title: "Ingrediente", key: "ingredients.name", minWidth: 200 },
  { title: "Quantidade", key: "quantity_needed", minWidth: 120 },
  { title: "Unidade", key: "units.abbreviation", minWidth: 100 },
  { title: "Status", key: "status", minWidth: 120 },
  { title: "Custo Est.", key: "estimated_cost", minWidth: 120 },
  { title: "Observações", key: "notes", minWidth: 200 },
  { title: "Criado em", key: "created_at", minWidth: 150 },
];

// Computed para calcular custo estimado
// const itemsWithEstimatedCost = computed(() => {
//   return purchaseList.value.map((item) => {
//     const ingredient = item.ingredients;
//     let estimatedCost = 0;

//     // Usar o custo real por unidade base
//     if (ingredient.real_cost_per_base_unit) {
//       estimatedCost = item.quantity_needed * ingredient.real_cost_per_base_unit;
//     }

//     return {
//       ...item,
//       estimated_cost: estimatedCost,
//       // Mostrar a unidade da purchase-list (que pode ser diferente da unidade base)
//       display_unit: item.units,
//     };
//   });
// });

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
</script>

<template>
  <UiTable
    v-model:page="page"
    v-model:items-per-page="itemsPerPage"
    v-model:selected="selectedItems"
    title="Lista de Compras"
    :items="items"
    item-value="id"
    :multi-sort="true"
    :headers="headers"
    :loading="loading"
    :total-items="totalItems"
    show-select
    class="rounded-b-lg rounded-t-xl"
    @update:options="store.fetchPurchaseList"
  >
    <template #buttons>
      <v-btn
        rounded="xl"
        color="grey"
        variant="text"
        density="comfortable"
        icon="mdi-filter-variant"
        @click="$emit('openFilter')"
      />

      <v-btn
        v-if="selectedItems.length > 0"
        rounded="xl"
        color="grey"
        variant="text"
        density="comfortable"
        icon="mdi-checkbox-multiple-marked"
        @click="$emit('openBulkActions')"
      />

      <v-btn
        rounded="xl"
        color="grey"
        variant="text"
        density="comfortable"
        icon="mdi-refresh"
        @click="store.fetchPurchaseList"
      />
    </template>

    <template #item.events.location="{ item }">
      <div>
        <div class="font-weight-medium">{{ item.events.location }}</div>
        <div class="text-caption text-grey">
          {{ item.events.guest_count }} convidados
        </div>
      </div>
    </template>

    <template #item.events.start_time="{ item }">
      {{ formatDate(item.events.start_time) }}
    </template>

    <template #item.events.clients.name="{ item }">
      {{ item.events.clients.name }}
    </template>

    <template #item.ingredients.name="{ item }">
      <div>
        <div class="font-weight-medium">{{ item.ingredients.name }}</div>
        <div class="text-caption text-grey">
          {{ item.ingredients.units.name }}
        </div>
      </div>
    </template>

    <template #item.quantity_needed="{ item }">
      <div class="text-right">
        {{ item.quantity_needed.toFixed(3) }}
      </div>
    </template>

    <template #item.units.abbreviation="{ item }">
      <v-chip size="small" variant="outlined">
        {{ item.units.abbreviation }}
      </v-chip>
    </template>

    <template #item.status="{ item }">
      <v-chip :color="getStatusColor(item.status)" size="small" variant="flat">
        {{ getStatusText(item.status) }}
      </v-chip>
    </template>

    <template #item.estimated_cost="{ item }">
      <div class="text-right">
        {{ formatCurrency(item.estimated_cost) }}
      </div>
    </template>

    <template #item.notes="{ item }">
      <div class="text-truncate" style="max-width: 200px">
        {{ item.notes || "-" }}
      </div>
    </template>

    <template #item.created_at="{ item }">
      {{ formatDate(item.created_at) }}
    </template>
  </UiTable>
</template>
