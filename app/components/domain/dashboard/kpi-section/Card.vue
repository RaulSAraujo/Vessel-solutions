<script lang="ts" setup>
interface Props {
  icon: string;
  title: number | string;
  color?: string;
  loading?: boolean;
  description: string;
  subtitle?: string;
  trend?: number;
  trendLabel?: string;
}

const props = defineProps<Props>();

const getTrendColor = (trend: number) => {
  if (trend > 0) return "success";
  if (trend < 0) return "error";
  return "grey";
};

const getTrendIcon = (trend: number) => {
  if (trend > 0) return "mdi-trending-up";
  if (trend < 0) return "mdi-trending-down";
  return "mdi-trending-neutral";
};
</script>

<template>
  <v-card
    class="pa-6 text-center border-sm position-relative overflow-hidden"
    elevation="3"
    rounded="xl"
    min-height="200"
    :color="color ? `${color}-lighten-5` : 'primary-lighten-5'"
  >
    <!-- Background Pattern -->
    <div
      class="position-absolute"
      style="top: -20px; right: -20px; opacity: 0.1"
    >
      <v-icon size="120" :color="color || 'primary'">{{ icon }}</v-icon>
    </div>

    <!-- Main Content -->
    <div
      class="position-relative d-flex flex-column justify-center align-center h-100"
    >
      <!-- Icon -->
      <v-avatar :color="color || 'primary'" size="48" class="mb-3">
        <v-icon size="24" color="white">{{ icon }}</v-icon>
      </v-avatar>

      <!-- Title -->
      <div v-if="!loading" class="text-h5 font-weight-bold mb-2">
        {{ title }}
      </div>
      <v-skeleton-loader v-else type="text" class="mb-2" />

      <!-- Description -->
      <div class="text-body-2 text-medium-emphasis mb-2 text-center">
        {{ description }}
      </div>

      <!-- Subtitle -->
      <div
        v-if="subtitle"
        class="text-caption text-medium-emphasis mb-2 text-center"
      >
        {{ subtitle }}
      </div>

      <!-- Trend -->
      <div
        v-if="trend !== undefined && trendLabel"
        class="d-flex align-center justify-center mt-auto"
      >
        <v-chip
          :color="getTrendColor(trend)"
          size="small"
          variant="flat"
          class="text-caption"
        >
          <v-icon :icon="getTrendIcon(trend)" size="16" class="mr-1" />
          {{ Math.abs(trend) }}% {{ trendLabel }}
        </v-chip>
      </div>
    </div>
  </v-card>
</template>
