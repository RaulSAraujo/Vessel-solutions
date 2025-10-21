<script setup lang="ts">
defineOptions({
  name: "ProfileLayout",
});
</script>
<template>
  <v-app>
    <Header />

    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>
