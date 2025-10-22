<script lang="ts" setup>
const items = [
  { value: "casual", text: "Casual" },
  { value: "corporate", text: "Corporativo" },
  { value: "premium", text: "Premium" },
];
</script>

<template>
  <UiSelectField
    label="Perfil"
    :items="items"
    item-title="text"
    item-value="value"
  />
</template>
