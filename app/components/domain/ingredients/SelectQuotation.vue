<script lang="ts" setup>
import { useIngredientsApi } from "~/composables/api/useIngredientsApi";
import type { VDataTableServerOptions } from "~/types/data-table";
import type { Datum } from "~/types/quotations";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "update:selected"]);

const api = useIngredientsApi();

const store = useIngredientsStore();
const { selectedIngredient } = storeToRefs(store);

const totalItems = ref(0);
const loading = ref(false);
const items = ref<Datum[]>([]);
const loadingSubmit = ref(false);
const selected = ref<Datum[]>([]);

const internalValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const headers = [
  { title: "Fornecedor", key: "suppliers.name", maxWidth: 150 },
  { title: "Ingrediente", key: "ingredients.name" },
  { title: "Preço", key: "purchase_price" },
  { title: "Quantidade", key: "purchase_quantity" },
  { title: "Unidade", key: "units.name", minWidth: 100 },
  { title: "Data da cotação", key: "quotation_date" },
];

watch(
  () => selectedIngredient.value,
  (value) => {
    const current = items.value.find(
      (item) => item.id === value?.current_quotation_id
    );

    selected.value = current ? [current] : [];
  }
);

async function fetchItems(options: VDataTableServerOptions) {
  loading.value = true;

  if (!selectedIngredient.value?.id) return;

  const res = await api.getQuotationByIngredientId(
    options,
    selectedIngredient.value.id
  );

  if (!res) {
    loading.value = false;
    return;
  }

  items.value = res.data;

  loading.value = false;
}

async function setQuotationIngredient() {
  if (!selected.value[0] || !selectedIngredient.value) return;

  loading.value = true;

  const res = await api.setQuotationForIngredient(
    selectedIngredient.value,
    selected.value[0]
  );

  if (!res) {
    loading.value = false;
    return;
  }

  store.updateItem(res);

  loading.value = false;

  store.fetchIngredients();

  internalValue.value = false;
}
</script>

<template>
  <v-bottom-sheet v-model="internalValue" content-class="rounded-t-xl">
    <v-card title="Selecione uma cotação" rounded="xl">
      <template #append>
        <v-btn
          width="200"
          rounded="lg"
          color="primary"
          :loading="loadingSubmit"
          prepend-icon="mdi-content-save"
          @click="setQuotationIngredient"
        >
          Salvar
        </v-btn>
      </template>

      <v-card-text>
        <v-data-table-server
          v-model="selected"
          :items="items"
          item-value="id"
          :headers="headers"
          :show-select="true"
          :return-object="true"
          select-strategy="single"
          :items-length="totalItems"
          @update:options="fetchItems"
        >
          <template #item.units.name="{ item }">
            {{ item.units.name }} ({{ item.units.abbreviation }})
          </template>

          <template #item.purchase_price="{ item }">
            {{ formatCurrency(item.purchase_price) }}
          </template>

          <template #item.quotation_date="{ item }">
            {{ formatDate(item.quotation_date) }}
          </template>
        </v-data-table-server>
      </v-card-text>
    </v-card>
  </v-bottom-sheet>
</template>
