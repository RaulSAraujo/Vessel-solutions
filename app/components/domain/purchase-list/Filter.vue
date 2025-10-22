<script lang="ts" setup>
import type { FilterDefinition } from "../../../types/filter";
import { ref } from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "applyFilters", "clearFilters"]);

// Usar store diretamente
const store = usePurchaseListStore();

const activeFilters = ref([]);

const filterDefinitions = ref<FilterDefinition[]>([
  {
    key: "events.location",
    label: "Evento",
    type: "string",
    op: "ilike",
    layout: {
      clearable: true,
    },
  },
  {
    key: "ingredients.name",
    label: "Ingrediente",
    type: "string",
    op: "ilike",
    layout: {
      clearable: true,
    },
  },
  {
    key: "status",
    label: "Status",
    type: "array",
    op: "eq",
    options: [
      { text: "Pendente", value: "pending" },
      { text: "Comprado", value: "purchased" },
      { text: "Cancelado", value: "cancelled" },
    ],
    layout: {
      clearable: true,
    },
  },
  {
    key: "quantity_needed",
    label: "Quantidade",
    type: "currency",
    op: "between",
    layout: {
      min: 0,
      max: 1000,
      step: 0.001,
    },
  },
  {
    key: "estimated_cost",
    label: "Custo Estimado",
    type: "currency",
    op: "between",
    layout: {
      min: 0,
      max: 1000,
      step: 0.01,
    },
  },
]);

function applyFilters() {
  store.fetchPurchaseList(activeFilters.value);
  emit("update:modelValue", false);
}

function clearFilters() {
  activeFilters.value = [];
  store.fetchPurchaseList();
  emit("update:modelValue", false);
}
</script>

<template>
  <v-navigation-drawer
    :model-value="modelValue"
    temporary
    location="right"
    width="280"
    class="pa-2"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <UiFilter
      v-model="activeFilters"
      :filter-definitions="filterDefinitions"
      @clear="clearFilters"
      @search="applyFilters"
    />
  </v-navigation-drawer>
</template>
