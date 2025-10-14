<script lang="ts" setup>
import type { TableDrinks } from "~/types/event-drinks";

defineProps<{
  drinks: TableDrinks[];
}>();

const emit = defineEmits(["delete"]);

const loadingDelete = ref(false);

const headers = [
  { title: "Ações", key: "actions", maxWidth: 60 },
  { title: "Nome", key: "name", minWidth: 200 },
  { title: "Categoria", key: "category", minWidth: 200 },
  { title: "Preço venda", key: "selling_price", minWidth: 140 },
  { title: "Marg. Lucro (%)", key: "profit_margin_percentage", minWidth: 155 },
  { title: "Quantidade Estimada", key: "estimated_quantity", minWidth: 150 },
  { title: "Quantidade utilizada", key: "actual_quantity", minWidth: 150 },
];

async function removeDrink(item: TableDrinks) {
  //   if (!item.new && myProps.drinkId) {
  //     loadingDelete.value = true;

  //     const res = await api.deleteDrinkIngredient(
  //       myProps.drinkId,
  //       item.ingredient_id
  //     );

  //     if (!res) {
  //       loadingDelete.value = false;
  //       return;
  //     }

  //     loadingDelete.value = false;
  //   }

  emit("delete", item);
}
</script>

<template>
  <v-data-table
    :headers="headers"
    :disable-sort="true"
    :items="drinks"
    :hide-default-footer="true"
    class="border-sm rounded-xl"
  >
    <template #item.actions="{ item }">
      <v-btn
        color="red"
        size="small"
        variant="plain"
        icon="mdi-delete"
        :loading="loadingDelete"
        @click="removeDrink(item)"
      />
    </template>

    <template #item.name="{ item }">
      <v-list-item
        :title="item.name"
        density="compact"
        lines="one"
        class="px-0"
      >
        <template #prepend>
          <v-menu
            v-if="item.image_url"
            offset="15"
            location="top end"
            :open-on-hover="true"
            scroll-strategy="close"
            open-delay="500"
          >
            <template #activator="{ props }">
              <v-avatar
                v-bind="props"
                :image="item.image_url"
                start
                size="28"
                color="grey"
                density="compact"
                class="mr-n2"
              />
            </template>

            <v-card width="200" max-height="200" rounded="lg">
              <v-img :src="item.image_url" />
            </v-card>
          </v-menu>

          <v-avatar
            v-else
            start
            size="28"
            color="grey"
            density="compact"
            class="mr-n2"
          >
            <v-icon color="white" size="16">mdi-image</v-icon>
          </v-avatar>
        </template>
      </v-list-item>
    </template>

    <template #item.selling_price="{ item }">
      {{ formatCurrency(item.selling_price) }}
    </template>

    <template #item.profit_margin_percentage="{ item }">
      {{ item.profit_margin_percentage.toFixed(1) }}
    </template>

    <template #item.estimated_quantity="{ item }">
      <UiNumberField v-model="item.estimated_quantity" :min="1" />
    </template>

    <template #item.actual_quantity="{ item }">
      <UiNumberField v-model="item.actual_quantity" :min="1" />
    </template>

    <template #bottom>
      <v-toolbar
        title="Valor total das bebidas:"
        density="compact"
        rounded="b-xl"
        color="transparent"
        border="t-thin"
      >
        <template #append>
          <span class="text-h6 font-weight-bold text-primary mr-12">
            {{
              formatCurrency(
                drinks.reduce(
                  (a, b) => a + b.selling_price * b.estimated_quantity,
                  0
                )
              )
            }}
          </span>
        </template>
      </v-toolbar>
    </template>
  </v-data-table>
</template>
