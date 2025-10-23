<script lang="ts" setup>
defineProps<{
  icon: string;
  title: string;
  description: string;
  color?: string;
}>();
</script>

<template>
  <v-card
    class="text-center"
    elevation="2"
    rounded="lg"
    :max-height="$vuetify.display.mobile ? '300' : '250'"
    :class="$vuetify.display.mobile ? 'pa-4' : 'pa-6'"
  >
    <v-icon
      :size="$vuetify.display.mobile ? '48' : '64'"
      :color="color || 'primary'"
      class="mb-4"
      :icon="icon"
    />

    <v-card-title
      class="justify-center"
      :class="$vuetify.display.mobile ? 'text-subtitle-1' : 'text-h6'"
    >
      {{ title }}
    </v-card-title>

    <v-card-text
      :class="$vuetify.display.mobile ? 'text-body-2' : 'text-body-1'"
    >
      {{ description }}
    </v-card-text>
  </v-card>
</template>
