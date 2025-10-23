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
  mobile?: boolean;
}

defineProps<Props>();

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
    rounded="xl"
    elevation="3"
    :min-height="mobile ? '150' : '200'"
    :color="color ? `${color}-lighten-5` : 'primary-lighten-5'"
    :class="[
      'text-center border-sm overflow-hidden position-relative',
      mobile ? 'pa-3' : 'pa-6',
    ]"
  >
    <!-- Background Pattern -->
    <div
      class="position-absolute"
      :style="
        mobile
          ? 'top: -10px; right: -10px; opacity: 0.1'
          : 'top: -20px; right: -20px; opacity: 0.1'
      "
    >
      <v-icon :size="mobile ? 80 : 120" :color="color || 'primary'">
        {{ icon }}
      </v-icon>
    </div>

    <!-- Main Content -->
    <div class="d-flex flex-column justify-center align-center">
      <!-- Icon -->
      <v-avatar
        :color="color || 'primary'"
        :size="mobile ? 36 : 48"
        :class="mobile ? 'mb-2' : 'mb-3'"
      >
        <v-icon :size="mobile ? 18 : 24" color="white">{{ icon }}</v-icon>
      </v-avatar>

      <!-- Title -->
      <div
        v-if="!loading"
        :class="
          mobile
            ? 'text-h6 font-weight-bold mb-1'
            : 'text-h5 font-weight-bold mb-2'
        "
      >
        {{ title }}
      </div>
      <v-skeleton-loader v-else :class="mobile ? 'mb-1' : 'mb-2'" type="text" />

      <!-- Description -->
      <div
        :class="[
          'text-medium-emphasis text-center',
          mobile ? 'text-caption mb-1' : 'text-body-2 mb-2',
        ]"
      >
        {{ description }}
      </div>

      <!-- Subtitle -->
      <div
        v-if="subtitle"
        :class="[
          'text-medium-emphasis text-center',
          mobile ? 'text-caption mb-1' : 'text-caption mb-2',
        ]"
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
          :size="mobile ? 'x-small' : 'small'"
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
