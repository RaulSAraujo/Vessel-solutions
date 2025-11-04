<script lang="ts" setup>
import type { Datum } from "~/types/ingredients";

const emit = defineEmits([
  "openFilter",
  "openCreation",
  "openUpdate",
  "openDelete",
  "openQuotation",
]);

const store = useIngredientsStore();
const { page, itemsPerPage, items, totalItems, loading, selectedIngredient } =
  storeToRefs(store);

const headers = [
  { title: "Ações", key: "actions", sortable: false },
  { title: "Nome", key: "name", maxWidth: 120 },
  { title: "Unid.", key: "units.name", maxWidth: 120 },
  { title: "Peso (g)", key: "unit_weight_g", minWidth: 110 },
  { title: "Vol. (ml)", key: "unit_volume_ml", minWidth: 110 },
  { title: "% Desperdício", key: "wastage_percentage", minWidth: 150 },
  { title: "C.R.U.B", key: "real_cost_per_base_unit" },
  { title: "Criado em", key: "created_at", minWidth: 120 },
  { title: "Atualizado em", key: "updated_at", minWidth: 150 },
];

function handleOpenUpdate(ingredient: Datum) {
  selectedIngredient.value = ingredient;
  emit("openUpdate");
}

function handleOpenDelete(ingredient: Datum) {
  selectedIngredient.value = ingredient;
  emit("openDelete");
}

function handleOpenQuotation(ingredient: Datum) {
  selectedIngredient.value = ingredient;
  emit("openQuotation");
}
</script>

<template>
  <UiTable
    v-model:page="page"
    v-model:items-per-page="itemsPerPage"
    title="Lista de ingredientes"
    :items="items"
    item-value="id"
    :headers="headers"
    :loading="loading"
    :total-items="totalItems"
    class="rounded-b-lg rounded-t-xl"
    @update:options="store.fetchIngredients"
  >
    <template #buttons>
      <v-tooltip location="top">
        <template #activator="{ props }">
          <v-icon v-bind="props" icon="mdi-information-outline" color="grey" />
        </template>

        <template #default>
          <p><strong>C.R.U.B:</strong> Custo Real Unidade Base</p>
          <p>
            <strong>Vol. (ml):</strong> Volume em mililitros (ml) da unidade
          </p>
          <p><strong>Peso (g):</strong> Peso em gramas (g) da unidade</p>
        </template>
      </v-tooltip>

      <v-btn
        id="tutorial-ingredients-btn-filter"
        rounded="xl"
        color="grey"
        variant="text"
        density="comfortable"
        icon="mdi-filter-variant"
        @click="$emit('openFilter')"
      />

      <v-btn
        id="tutorial-ingredients-btn-refresh"
        rounded="xl"
        color="grey"
        variant="text"
        icon="mdi-refresh"
        density="comfortable"
        @click="store.fetchIngredients"
      />

      <v-btn
        id="tutorial-ingredients-btn-create"
        rounded="xl"
        color="grey"
        icon="mdi-plus"
        variant="text"
        density="comfortable"
        @click="$emit('openCreation')"
      />
    </template>

    <template #item.actions="{ item }">
      <UiTableActions
        :tutorial-id="item.id === items[0]?.id ? 'tutorial-ingredients' : ''"
        @edit="handleOpenUpdate(item)"
        @delete="handleOpenDelete(item)"
      >
        <template #items>
          <v-divider />

          <v-list-item
            title="Selecionar cotação"
            base-color="success"
            @click="handleOpenQuotation(item)"
          >
            <template #prepend>
              <v-icon size="small" start icon="mdi-currency-usd" />
            </template>
          </v-list-item>
        </template>
      </UiTableActions>
    </template>

    <template #item.name="{ item }">
      <UiTextWithTooltip :text="item.name" />
    </template>

    <template #item.units.name="{ item }">
      <UiTextWithTooltip
        :text="`${item.units.name} (${item.units.abbreviation})`"
      />
    </template>

    <template #item.real_cost_per_base_unit="{ item }">
      <span
        v-if="
          item.real_cost_per_base_unit &&
          typeof item.real_cost_per_base_unit == 'number'
        "
      >
        R$
        {{
          (item.real_cost_per_base_unit as number).toFixed(4).replace(".", ",")
        }}
      </span>
    </template>

    <template #item.created_at="{ item }">
      {{ formatDate(item.created_at) }}
    </template>

    <template #item.updated_at="{ item }">
      {{ formatDate(item.updated_at) }}
    </template>
  </UiTable>
</template>
