<script setup lang="ts">
import type { PeriodFilter } from "~/composables/usePeriodFilter";

interface Props {
  title: string;
  description: string;
  period?: PeriodFilter;
}

defineProps<Props>();

const emit = defineEmits<{
  "update:period": [period: PeriodFilter];
}>();

function handlePeriodUpdate(period: PeriodFilter) {
  emit("update:period", period);
}
</script>

<template>
  <v-container fluid class="pa-0">
    <!-- Header -->
    <v-container fluid class="py-4">
      <v-row align="center">
        <v-col cols="12" md="8">
          <div>
            <h1 class="text-h4 font-weight-bold text-primary mb-2">
              {{ title }}
            </h1>
            <p class="text-body-1 text-medium-emphasis mb-0">
              {{ description }}
            </p>
          </div>
        </v-col>

        <v-col cols="12" md="4">
          <div class="d-flex justify-end">
            <UiPeriodFilter
              :period="period"
              @update:period="handlePeriodUpdate"
            />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>
