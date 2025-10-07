<script lang="ts" setup></script>

<template>
  <UiFindServerField
    item-title="name"
    item-value="name"
    search-field="name"
    :return-object="true"
    table-name="ingredients"
    label="Buscar ingredientes"
    prepend-inner-icon="mdi-food-variant"
    :select-query="`
      *,
      units (
        name,
        abbreviation
      )
    `"
  />
</template>
