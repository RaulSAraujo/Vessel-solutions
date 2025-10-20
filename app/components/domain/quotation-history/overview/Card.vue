<script setup lang="ts">
interface Props {
  title: string;
  value: string | number;
  icon: string;
  color?: string;
  loading?: boolean;
  subtitle?: string;
  trend?: {
    value: number;
    direction: "up" | "down" | "neutral";
  };
}

withDefaults(defineProps<Props>(), {
  color: "primary",
  loading: false,
});

const colorClasses: Record<string, string> = {
  primary: "text-primary",
  success: "text-success",
  warning: "text-warning",
  error: "text-error",
  info: "text-info",
};

const avatarColors: Record<string, string> = {
  primary: "primary",
  success: "success",
  warning: "warning",
  error: "error",
  info: "info",
};

const trendIcons = {
  up: "mdi-trending-up",
  down: "mdi-trending-down",
  neutral: "mdi-minus",
};

const trendColors = {
  up: "text-success",
  down: "text-error",
  neutral: "text-medium-emphasis",
};
</script>

<template>
  <v-card elevation="2" class="pa-4 border-sm" rounded="xl">
    <div class="d-flex align-center">
      <v-avatar :color="avatarColors[color]" size="48" class="me-4">
        <v-icon color="white" size="24">{{ icon }}</v-icon>
      </v-avatar>
      <div class="flex-grow-1">
        <div :class="['text-h6 font-weight-bold', colorClasses[color]]">
          {{ value }}
        </div>
        <div class="text-body-2 text-medium-emphasis">{{ title }}</div>
        <div v-if="subtitle" class="text-caption text-medium-emphasis">
          {{ subtitle }}
        </div>
        <div v-if="trend" class="d-flex align-center mt-1">
          <v-icon :class="trendColors[trend.direction]" size="16" class="me-1">
            {{ trendIcons[trend.direction] }}
          </v-icon>
          <span :class="['text-caption', trendColors[trend.direction]]">
            {{ Math.abs(trend.value).toFixed(1) }}%
          </span>
        </div>
      </div>
    </div>
    <v-progress-linear
      v-if="loading"
      indeterminate
      :color="color"
      class="mt-2"
    />
  </v-card>
</template>
