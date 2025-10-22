<script lang="ts" setup>
import type { PropType } from "vue";
import { computed } from "vue";

const props = defineProps({
  modelValue: {
    type: String as PropType<string | null>,
    default: null,
  },
});

const emit = defineEmits(["update:modelValue"]);

const items = [
  { value: "proposal", text: "Proposta" },
  { value: "confirmed", text: "Confirmado" },
  { value: "purchase", text: "Comprar" },
  { value: "in_progress", text: "Em andamento" },
  { value: "completed", text: "Concluído" },
  { value: "cancelled", text: "Cancelado" },
];

const icon = computed(() => {
  switch (props.modelValue) {
    case "proposal":
      return "mdi-file-document";
    case "confirmed":
      return "mdi-check-circle";
    case "in_progress":
      return "mdi-progress-clock";
    case "completed":
      return "mdi-check-circle-outline";
    case "cancelled":
      return "mdi-cancel";
    case "purchase":
      return "mdi-cart";
    default:
      return "mdi-help-circle";
  }
});

const internalValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>

<template>
  <UiSelectField
    v-model="internalValue"
    label="Status"
    :items="items"
    item-title="text"
    item-value="value"
    hide-details="auto"
  >
    <template #prepend-inner>
      <v-icon :icon="icon" />
    </template>
  </UiSelectField>
</template>
