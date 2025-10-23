<script lang="ts" setup>
defineProps<{
  image: string;
  imageAlt: string;
  description: string;
  subtitle: string;
}>();
</script>

<template>
  <v-card
    elevation="2"
    rounded="lg"
    :max-height="$vuetify.display.mobile ? '400' : '450'"
    :class="$vuetify.display.mobile ? 'pa-4' : 'pa-6'"
  >
    <v-avatar :size="$vuetify.display.mobile ? '72' : '96'" class="mb-4">
      <v-img :src="image" :alt="imageAlt" />
    </v-avatar>

    <v-card-text
      class="font-italic"
      :class="$vuetify.display.mobile ? 'text-body-1' : 'text-h6'"
    >
      {{ description }}
    </v-card-text>

    <v-card-subtitle
      class="font-weight-bold"
      :class="$vuetify.display.mobile ? 'text-body-2' : 'text-subtitle-1'"
    >
      {{ subtitle }}
    </v-card-subtitle>
  </v-card>
</template>
