<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script lang="ts" setup>
import Fields from "./fields/index.vue";
import GroupBtn from "./group-btn/index.vue";
import type { FilterDefinition } from "~/types/filter";

const props = defineProps({
  modelValue: {
    type: Object as PropType<Record<string, any>>,
    required: true,
  },
  filterDefinitions: {
    type: Array as PropType<FilterDefinition[]>,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue", "search", "clear"]);

/**
 * Computed property para gerenciar o v-model.
 * Garante que o valor seja lido de `modelValue` e emitido via `update:modelValue`.
 */
const internalValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const resetFilters = () => {
  internalValue.value = {};
  emit("clear");
};
</script>

<template>
  <div class="d-flex flex-column py-2" style="width: 100%; height: 100%">
    <Fields
      v-model="internalValue"
      :filters="filterDefinitions"
      @search="emit('search', internalValue)"
    />

    <v-spacer />

    <v-divider class="my-4" />

    <GroupBtn @clear="resetFilters" @search="emit('search', internalValue)" />
  </div>
</template>
