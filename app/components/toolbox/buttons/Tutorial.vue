<script lang="ts" setup>
import ToolboxButton from "./Button.vue";

// Tutorial
const tutorialRouter = useTutorialRouter();
const route = useRoute();
const tutorial = useTutorialDriver();

// Reiniciar tutorial (limpar localStorage e iniciar novamente)
const startTutorial = async () => {
  if (!process.client) return;
  
  const routePath = route.path;
  
  // Limpar marcação de tutorial completado para esta rota
  tutorial.clearTutorialCompleted(routePath);
  
  // Iniciar tutorial novamente
  await tutorialRouter.startTutorialForRoute(routePath);
};
</script>

<template>
  <ToolboxButton
    tooltip="Reiniciar Tutorial"
    icon="mdi-school"
    @click="startTutorial"
  />
</template>
