<script lang="ts" setup>
import { useDrinksApi } from "~/composables/api/useDrinksApi";
import type { TableDrinkIngredients } from "~/types/drink-ingredient";

const myProps = defineProps<{
  units: Units[];
  loading: boolean;
  drinkId?: string | undefined;
  drinkIngredients: TableDrinkIngredients[];
}>();

const emit = defineEmits(["delete"]);

const api = useDrinksApi();

const loadingDelete = ref(false);

const headers = [
  { title: "Ações", key: "actions", maxWidth: 60 },
  { title: "Nome", key: "name", minWidth: 110, maxWidth: 150 },
  { title: "Quantidade", key: "quantity", minWidth: 150 },
  { title: "Unid. base", key: "unit_id", minWidth: 150 },
  { title: "C.R.U.B", key: "real_cost_per_base_unit", minWidth: 120 },
  { title: "Custo unitário", key: "cost_unit", minWidth: 130 },
];

async function deleteDrinkIngredient(item: TableDrinkIngredients) {
  if (!item.new && myProps.drinkId) {
    loadingDelete.value = true;

    const res = await api.deleteDrinkIngredient(
      myProps.drinkId,
      item.ingredient_id
    );

    if (!res) {
      loadingDelete.value = false;
      return;
    }

    loadingDelete.value = false;
  }

  emit("delete", item);
}

function calculeCostUnit(item: TableDrinkIngredients) {
  try {
    if (!item.unit_id) return 0;

    const converted = convertQuantity(
      item.quantity,
      item.ingredient_unit_id,
      item.unit_id!,
      myProps.units,
      {
        unit_volume_ml: item.unit_volume_ml,
        unit_weight_g: item.unit_weight_g,
      }
    );

    const itemCost = converted * (item.real_cost_per_base_unit || 0);

    item.cost_unit = itemCost;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    $toast().error("Erro ao calcular o custo unitário");

    item.cost_unit = 0;
  }
}
</script>

<template>
  <v-data-table
    :headers="headers"
    :loading="loading"
    :disable-sort="true"
    :items="drinkIngredients"
    :hide-default-footer="true"
    class="border-sm rounded-xl"
  >
    <template #header.real_cost_per_base_unit>
      <span class="text-right">
        C.R.U.B

        <v-tooltip location="top">
          <template #activator="{ props }">
            <v-icon
              v-bind="props"
              icon="mdi-information-outline"
              color="grey"
            />
          </template>

          <template #default>
            <p>Custo Real Unidade Base</p>
          </template>
        </v-tooltip>
      </span>
    </template>

    <template #item.actions="{ item }">
      <v-btn
        color="red"
        size="small"
        variant="plain"
        icon="mdi-delete"
        :loading="loadingDelete"
        @click="deleteDrinkIngredient(item)"
      />
    </template>

    <template #item.quantity="{ item }">
      <UiNumberField
        v-model="item.quantity"
        :min="1"
        :step="0.01"
        :precision="2"
        control-variant="stacked"
        @update:model-value="calculeCostUnit(item)"
      />
    </template>

    <template #item.unit_id="{ item }">
      <UiAutocompleteField
        v-model="item.unit_id"
        :items="units || []"
        item-value="id"
        item-title="name"
        label="Unidade"
        @update:model-value="calculeCostUnit(item)"
      >
        <template #item="{ props, item: { raw } }">
          <v-list-item
            lines="one"
            elevation="0"
            v-bind="props"
            :title="raw.name"
          >
            <template #append>
              <span class="text-caption">({{ raw.abbreviation }})</span>
            </template>
          </v-list-item>
        </template>
      </UiAutocompleteField>
    </template>

    <template #item.real_cost_per_base_unit="{ item }">
      <span>
        R$ {{ item.real_cost_per_base_unit?.toFixed(4).replace(".", ",") }}
      </span>
    </template>

    <template #item.cost_unit="{ item }">
      <span>{{ formatCurrency(item.cost_unit) }}</span>
    </template>

    <template #bottom>
      <v-toolbar
        title="Custo total:"
        density="compact"
        rounded="b-xl"
        color="transparent"
        border="t-thin"
      >
        <template #append>
          <span class="text-h6 font-weight-bold text-primary mr-12">
            {{
              formatCurrency(
                drinkIngredients.reduce((a, b) => a + b.cost_unit, 0)
              )
            }}
          </span>
        </template>
      </v-toolbar>
    </template>
  </v-data-table>
</template>
