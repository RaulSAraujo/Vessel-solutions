<script lang="ts" setup>
import type { TableDrinks } from "~/types/event-drinks";

defineProps<{
  item: TableDrinks;
}>();
</script>

<template>
  <v-list-item :title="item.name" density="compact" lines="one" class="px-0">
    <template #prepend>
      <v-menu
        v-if="item.image_url"
        offset="15"
        location="top end"
        :open-on-hover="true"
        scroll-strategy="close"
        open-delay="500"
      >
        <template #activator="{ props: bind }">
          <v-avatar
            v-bind="bind"
            :image="item.image_url"
            start
            size="28"
            color="grey"
            density="compact"
            class="mr-n2"
          />
        </template>

        <v-card width="200" max-height="200" rounded="lg">
          <v-img :src="item.image_url" />
        </v-card>
      </v-menu>

      <v-avatar
        v-else
        start
        size="28"
        color="grey"
        density="compact"
        class="mr-n2"
      >
        <v-icon color="white" size="16">mdi-image</v-icon>
      </v-avatar>
    </template>
  </v-list-item>
</template>
