<script lang="ts" setup>
import type { MaskInputOptions } from "maska";

const options = reactive<MaskInputOptions>({
  mask: ["###.###.###-##", "##.###.###/####-##"],
  eager: true,
});
</script>

<template>
  <UiFindServerField
    v-maska="options"
    label="Cpf/Cnpj"
    hide-details="auto"
    table-name="clients"
    :return-object="true"
    item-title="document"
    item-value="document"
    search-field="document"
    prepend-inner-icon="mdi-card-account-details"
  >
    <template #item="{ props, item }">
      <v-list-item
        lines="one"
        elevation="0"
        v-bind="props"
        :title="item.raw.name"
      >
        <template #append>
          <span class="text-caption">({{ item.raw.document }})</span>
        </template>
      </v-list-item>
    </template>
  </UiFindServerField>
</template>
