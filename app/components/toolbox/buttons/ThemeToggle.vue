<script lang="ts" setup>
import ToolboxButton from "./Button.vue";

const theme = useTheme();
const themeStore = useThemeStore();
const user = useSupabaseUser();

const toggleTheme = async () => {
  theme.cycle();
  const currentTheme = theme.current.value.dark ? "dark" : "light";
  await themeStore.saveTheme(currentTheme, user);
};

const tooltipText = computed(() =>
  theme.current.value.dark ? "Modo Claro" : "Modo Escuro"
);

const icon = computed(() =>
  theme.current.value.dark ? "mdi-weather-sunny" : "mdi-weather-night"
);
</script>

<template>
  <ToolboxButton
    :tooltip="tooltipText"
    :icon="icon"
    @click="toggleTheme"
  />
</template>

