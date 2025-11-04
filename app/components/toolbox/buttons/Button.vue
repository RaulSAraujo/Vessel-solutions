<script lang="ts" setup>
interface Props {
  tooltip: string;
  icon: string;
  to?: string;
  onClick?: () => void;
}

const props = defineProps<Props>();
</script>

<template>
  <v-tooltip :text="tooltip" location="top">
    <template #activator="{ props: tooltipProps }">
      <v-btn
        v-bind="tooltipProps"
        icon
        size="small"
        variant="text"
        :to="to"
        @click="onClick"
      >
        <v-icon>{{ icon }}</v-icon>
      </v-btn>
    </template>
  </v-tooltip>
</template>

