<script setup>
const { applySavedTheme } = useThemePersistence();

applySavedTheme();
</script>

<template>
  <NuxtLoadingIndicator />

  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
