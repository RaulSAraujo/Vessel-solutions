<script setup lang="ts">
interface Props {
  title: string;
  subtitle?: string;
  value: string | number;
  icon: string;
  color?: string;
  loading?: boolean;
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
  primary: "bg-primary-lighten-5 text-primary",
  success: "bg-success-lighten-5 text-success",
  warning: "bg-warning-lighten-5 text-warning",
  error: "bg-error-lighten-5 text-error",
  info: "bg-info-lighten-5 text-info",
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
  <div :class="['d-flex align-center pa-3 rounded-lg', colorClasses[color]]">
    <v-avatar :color="avatarColors[color]" size="40" class="me-3">
      <v-icon color="white" size="20">{{ icon }}</v-icon>
    </v-avatar>
    <div class="flex-grow-1">
      <div class="text-body-2 font-weight-medium">
        {{ title }}
      </div>
      <div v-if="subtitle" class="text-caption text-medium-emphasis">
        {{ subtitle }}
      </div>
      <div class="text-body-2 font-weight-bold">
        {{ value }}
        <div v-if="trend" class="d-flex align-center mt-1">
          <v-icon :class="trendColors[trend.direction]" size="14" class="me-1">
            {{ trendIcons[trend.direction] }}
          </v-icon>
          <span :class="['text-caption', trendColors[trend.direction]]">
            {{ Math.abs(trend.value).toFixed(1) }}%
          </span>
        </div>
      </div>
    </div>
    <v-progress-circular
      v-if="loading"
      indeterminate
      :color="avatarColors[color]"
      size="20"
    />
  </div>
</template>
