<script lang="ts" setup>
const props = defineProps({
  modelValue: {
    type: String as PropType<string | null>,
    default: null,
  },
});

const emit = defineEmits(["update:modelValue"]);

const items = [
  "Proposta",
  "Confirmado",
  "Em andamento",
  "Concluído",
  "Cancelado",
];

const icon = computed(() => {
  switch (props.modelValue) {
    case "Proposta":
      return "mdi-file-document";
    case "Confirmado":
      return "mdi-check-circle";
    case "Em andamento":
      return "mdi-progress-clock";
    case "Concluído":
      return "mdi-check-circle-outline";
    case "Cancelado":
      return "mdi-cancel";
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
    hide-details="auto"
  >
    <template #prepend-inner>
      <v-icon :icon="icon" />
    </template>
  </UiSelectField>
</template>
