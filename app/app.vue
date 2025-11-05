<script setup>
const theme = useTheme();
const themeStore = useThemeStore();
const user = useSupabaseUser();

// Inicializa watchers (user e theme)
themeStore.initializeWatchers(theme, user);

// Inicializa o tema no store
themeStore.initializeTheme(user.value?.user_metadata?.theme_preference);

// Aplica o tema salvo
themeStore.applySavedTheme(theme);
</script>

<template>
  <NuxtLoadingIndicator />

  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <!-- Componente global para alerta de expiração de acesso temporário -->
  <TemporaryAccessWarning />
</template>

<style>
/* Barra de scroll aparece apenas quando necessário */
html {
  overflow-y: auto;
}

body {
  overflow-y: auto;
}
</style>
