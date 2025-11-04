<script lang="ts" setup>
interface Props {
  tooltip: string;
  icon: string;
  to?: string;
}

defineProps<Props>();

defineEmits(["click"]);
</script>

<template>
  <v-tooltip :text="tooltip" location="top">
    <template #activator="{ props: tooltipProps }">
      <v-btn
        v-bind="tooltipProps"
        icon
        :to="to"
        size="small"
        variant="text"
        @click="$emit('click')"
      >
        <v-icon>{{ icon }}</v-icon>
      </v-btn>
    </template>
  </v-tooltip>
</template>
