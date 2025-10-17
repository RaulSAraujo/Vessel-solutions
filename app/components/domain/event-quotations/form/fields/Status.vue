<script lang="ts" setup>
const props = defineProps({
  modelValue: {
    type: String as PropType<string | null>,
    default: null,
  },
});

const emit = defineEmits(["update:modelValue"]);

const statusOptions = [
  { value: "draft", label: "Rascunho" },
  { value: "sent", label: "Enviado" },
  { value: "approved", label: "Aprovado" },
  { value: "rejected", label: "Rejeitado" },
  { value: "converted", label: "Convertido" },
];

const items = statusOptions.map((option) => option.label);

const icon = computed(() => {
  switch (props.modelValue) {
    case "draft":
      return "mdi-pencil";
    case "sent":
      return "mdi-send";
    case "approved":
      return "mdi-check";
    case "rejected":
      return "mdi-close";
    case "converted":
      return "mdi-check-circle";
    default:
      return "mdi-help-circle";
  }
});

const internalValue = computed({
  get: () => {
    const option = statusOptions.find((opt) => opt.value === props.modelValue);
    return option ? option.label : null;
  },
  set: (value) => {
    const option = statusOptions.find((opt) => opt.label === value);
    emit("update:modelValue", option ? option.value : null);
  },
});
</script>

<template>
  <UiSelectField
    v-model="internalValue"
    label="Status"
    :items="items"
    item-title="label"
    item-value="value"
    hide-details="auto"
  >
    <template #prepend-inner>
      <v-icon :icon="icon" />
    </template>
  </UiSelectField>
</template>
