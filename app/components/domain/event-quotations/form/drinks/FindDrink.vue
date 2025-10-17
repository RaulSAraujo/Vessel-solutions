<script lang="ts" setup></script>

<template>
  <UiFindServerField
    label="Buscar bebidas"
    hide-details="auto"
    table-name="drinks"
    :return-object="true"
    item-title="name"
    item-value="name"
    search-field="name"
    prepend-inner-icon="mdi-glass-cocktail"
    :select-query="`
      *,
      drink_categories (
        name
      )
    `"
  >
    <template #item="{ props, item }">
      <v-list-item
        lines="one"
        elevation="0"
        v-bind="props"
        :title="item.raw.name"
      >
        <template #prepend>
          <v-avatar
            v-if="item.raw.image_url"
            :image="item.raw.image_url"
            start
            size="28"
            color="grey"
            density="compact"
            class="mr-n2"
          />

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
  </UiFindServerField>
</template>
