<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { watchDebounced } from "@vueuse/core";
import dayjs from "dayjs";

interface PeriodOption {
  label: string;
  value: string;
  startDate: string;
  endDate: string;
}

const emit = defineEmits<{
  "update:period": [
    period: { startDate: string; endDate: string; label: string }
  ];
}>();

const selectedPeriod = ref("last-30-days");

// Opções de período predefinidas
const periodOptions: PeriodOption[] = [
  {
    label: "Últimos 7 dias",
    value: "last-7-days",
    startDate: dayjs().subtract(7, "day").format("YYYY-MM-DD"),
    endDate: dayjs().format("YYYY-MM-DD"),
  },
  {
    label: "Últimos 30 dias",
    value: "last-30-days",
    startDate: dayjs().subtract(30, "day").format("YYYY-MM-DD"),
    endDate: dayjs().format("YYYY-MM-DD"),
  },
  {
    label: "Últimos 90 dias",
    value: "last-90-days",
    startDate: dayjs().subtract(90, "day").format("YYYY-MM-DD"),
    endDate: dayjs().format("YYYY-MM-DD"),
  },
  {
    label: "Este mês",
    value: "this-month",
    startDate: dayjs().startOf("month").format("YYYY-MM-DD"),
    endDate: dayjs().endOf("month").format("YYYY-MM-DD"),
  },
  {
    label: "Mês passado",
    value: "last-month",
    startDate: dayjs()
      .subtract(1, "month")
      .startOf("month")
      .format("YYYY-MM-DD"),
    endDate: dayjs().subtract(1, "month").endOf("month").format("YYYY-MM-DD"),
  },
  {
    label: "Este ano",
    value: "this-year",
    startDate: dayjs().startOf("year").format("YYYY-MM-DD"),
    endDate: dayjs().endOf("year").format("YYYY-MM-DD"),
  },
  {
    label: "Ano passado",
    value: "last-year",
    startDate: dayjs().subtract(1, "year").startOf("year").format("YYYY-MM-DD"),
    endDate: dayjs().subtract(1, "year").endOf("year").format("YYYY-MM-DD"),
  },
  {
    label: "Personalizado",
    value: "custom",
    startDate: dayjs().subtract(30, "day").format("YYYY-MM-DD"),
    endDate: dayjs().format("YYYY-MM-DD"),
  },
];

const customStartDate = ref(dayjs().subtract(30, "day").format("DD/MM/YYYY"));
const customEndDate = ref(dayjs().format("DD/MM/YYYY"));

const isCustomPeriod = computed(() => selectedPeriod.value === "custom");
const isDebouncing = ref(false);

const currentPeriod = computed(() => {
  if (isCustomPeriod.value) {
    // Converter de DD/MM/YYYY para YYYY-MM-DD para as APIs
    const startDate = dayjs(customStartDate.value, "DD/MM/YYYY").format(
      "YYYY-MM-DD"
    );
    const endDate = dayjs(customEndDate.value, "DD/MM/YYYY").format(
      "YYYY-MM-DD"
    );

    return {
      startDate,
      endDate,
      label: `Personalizado (${customStartDate.value} - ${customEndDate.value})`,
    };
  }

  const option = periodOptions.find(
    (opt) => opt.value === selectedPeriod.value
  );
  return {
    startDate: option?.startDate || "",
    endDate: option?.endDate || "",
    label: option?.label || "",
  };
});

// Emitir mudanças no período para períodos predefinidos
watch(
  selectedPeriod,
  () => {
    if (!isCustomPeriod.value) {
      emit("update:period", currentPeriod.value);
    }
  },
  { immediate: true }
);

// Validar datas customizadas
const validateCustomDates = () => {
  if (isCustomPeriod.value) {
    const start = dayjs(customStartDate.value, "DD/MM/YYYY");
    const end = dayjs(customEndDate.value, "DD/MM/YYYY");

    if (start.isAfter(end)) {
      customEndDate.value = start.add(1, "day").format("DD/MM/YYYY");
    }
  }
};

// Watch imediato para validação de datas
watch([customStartDate, customEndDate], validateCustomDates);

// Watch com debounce para emitir mudanças nas datas customizadas
watchDebounced(
  [customStartDate, customEndDate],
  () => {
    if (isCustomPeriod.value) {
      isDebouncing.value = false;
      if (
        dayjs(currentPeriod.value.startDate).isValid() &&
        dayjs(currentPeriod.value.endDate).isValid()
      ) {
        emit("update:period", currentPeriod.value);
      }
    }
  },
  {
    debounce: 500, // 500ms de debounce
    maxWait: 2000, // Máximo 2 segundos de espera
    immediate: false, // Não executar imediatamente
  }
);

// Watch para detectar quando o debounce está ativo
watch([customStartDate, customEndDate], () => {
  if (isCustomPeriod.value) {
    isDebouncing.value = true;
  }
});
</script>

<template>
  <div class="d-flex align-center gap-3 flex-wrap">
    <!-- Seletor de período -->
    <UiSelectField
      v-model="selectedPeriod"
      :items="periodOptions"
      item-title="label"
      item-value="value"
      label="Período"
      variant="outlined"
      density="compact"
      hide-details
      style="min-width: 180px"
      class="mr-2"
    >
      <template #prepend-inner>
        <v-icon color="primary" icon="mdi-calendar-range" />
      </template>
    </UiSelectField>

    <!-- Campos de data customizada -->
    <template v-if="isCustomPeriod">
      <UiDateField
        v-model="customStartDate"
        label="Data inicial"
        variant="outlined"
        density="compact"
        hide-details
        class="mr-2"
        style="min-width: 150px"
        @save="(date) => (customStartDate = date)"
      />

      <UiDateField
        v-model="customEndDate"
        label="Data final"
        variant="outlined"
        density="compact"
        hide-details
        class="mr-2"
        style="min-width: 150px"
        @save="(date) => (customEndDate = date)"
      />
    </template>

    <!-- Indicador do período atual -->
    <v-chip
      color="primary"
      variant="flat"
      size="small"
      class="text-caption"
      :class="{ 'opacity-75': isDebouncing }"
    >
      <v-icon
        start
        :icon="isDebouncing ? 'mdi-loading' : 'mdi-calendar'"
        size="16"
        :class="{ 'animate-spin': isDebouncing }"
      />

      {{ currentPeriod.label }}
    </v-chip>
  </div>
</template>

<style scoped>
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
