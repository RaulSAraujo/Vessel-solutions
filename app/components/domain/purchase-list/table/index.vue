<script lang="ts" setup>
import Status from "./Status.vue";
import EstimatedCost from "./EstimatedCost.vue";

defineEmits(["openFilter", "openBulkActions"]);

// Usar store diretamente
const store = usePurchaseListStore();
const { items, loading, selectedItems, page, itemsPerPage, totalItems } =
  storeToRefs(store);

const headers = [
  { title: "Evento", key: "events.location", minWidth: 200 },
  { title: "Data do Evento", key: "events.start_time", minWidth: 150 },
  { title: "Cliente", key: "events.clients.name", minWidth: 150 },
  { title: "Ingrediente", key: "ingredient.name", minWidth: 200 },
  { title: "Quantidade", key: "quantity_needed", minWidth: 120 },
  { title: "Status", key: "status", minWidth: 120 },
  { title: "Custo Est.", key: "estimated_cost", minWidth: 120 },
  { title: "Observações", key: "notes", maxWidth: 200 },
  { title: "Criado em", key: "created_at", minWidth: 150 },
];
</script>

<template>
  <UiTable
    v-model:page="page"
    v-model:selected="selectedItems"
    v-model:items-per-page="itemsPerPage"
    title="Lista de Compras"
    :items="items"
    item-value="id"
    :multi-sort="true"
    :headers="headers"
    :loading="loading"
    :show-select="true"
    select-strategy="all"
    :return-object="true"
    :total-items="totalItems"
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

    <template #item.quantity_needed="{ item }">
      <div>
        <span>{{ item.quantity_needed }}</span>

        <span class="text-caption text-grey">
          ({{ item.units.abbreviation }})
        </span>
      </div>
    </template>

    <template #item.status="{ item }">
      <Status :status="item.status" />
    </template>

    <template #item.notes="{ item }">
      <UiTextWithTooltip :text="item.notes" />
    </template>

    <template #item.created_at="{ item }">
      {{ formatDate(item.created_at) }}
    </template>
  </UiTable>
</template>
