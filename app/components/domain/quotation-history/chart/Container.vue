<script setup lang="ts">
interface Props {
  title: string;
  loading?: boolean;
  empty?: boolean;
  emptyMessage?: string;
  emptyIcon?: string;
  showExport?: boolean;
  height?: string | number;
}

withDefaults(defineProps<Props>(), {
  loading: false,
  empty: false,
  emptyMessage: "Nenhum dado disponível para o período selecionado",
  emptyIcon: "mdi-chart-bar",
  showExport: true,
  height: 470,
});

const emit = defineEmits<{
  export: [];
}>();

const handleExport = () => {
  emit("export");
};
</script>

<template>
  <v-card elevation="2" class="pa-4 border-sm" rounded="xl" :height="height">
    <div class="d-flex align-center justify-space-between mb-4">
      <h3 class="text-h6 font-weight-bold">{{ title }}</h3>
      <v-btn
        v-if="showExport"
        icon="mdi-download"
        variant="text"
        size="small"
        color="primary"
        @click="handleExport"
      >
        <v-icon>mdi-download</v-icon>
        <v-tooltip activator="parent" location="top">
          Exportar Gráfico
        </v-tooltip>
      </v-btn>
    </div>

    <div
      v-if="loading"
      class="d-flex align-center justify-center"
      :style="{ height: `${Number(height) - 100}px` }"
    >
      <v-progress-circular indeterminate color="primary" size="48" />
    </div>

    <div
      v-else-if="empty"
      class="d-flex align-center justify-center"
      :style="{ height: `${Number(height) - 100}px` }"
    >
      <div class="text-center">
        <v-icon size="48" color="grey-lighten-1" class="mb-2">
          {{ emptyIcon }}
        </v-icon>
        <div class="text-body-1 text-medium-emphasis">
          {{ emptyMessage }}
        </div>
      </div>
    </div>

    <div
      v-else
      :style="{ height: `${Number(height) - 100}px`, position: 'relative' }"
    >
      <slot />
    </div>
  </v-card>
</template>
