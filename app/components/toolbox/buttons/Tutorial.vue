<script lang="ts" setup>
import ToolboxButton from "./Button.vue";
import type { TutorialStep } from "~/composables/useTutorialDriver";

// Tutorial
const tutorial = useTutorialDriver();
const { mobile } = useDisplay();
const route = useRoute();

const startTutorial = async () => {
  if (!process.client) return;

  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Obter os steps do tutorial baseado na rota atual
  const routePath = route.path;
  let steps: TutorialStep[] | null = null;

  // Importar e obter os steps do tutorial da página atual
  if (routePath === "/dashboard") {
    const { dashboardTutorialSteps } = await import(
      "~/data/tutorials/dashboard"
    );
    steps = dashboardTutorialSteps(mobile.value);
  }
  // Aqui podem ser adicionados outros tutoriais para outras páginas
  // else if (routePath === "/quotations") {
  //   const { quotationsTutorialSteps } = await import("~/data/tutorials/quotations");
  //   steps = quotationsTutorialSteps(mobile.value);
  // }

  if (steps) {
    tutorial.startTutorial(steps);
  }
};
</script>

<template>
  <ToolboxButton
    tooltip="Reiniciar Tutorial"
    icon="mdi-school"
    @click="startTutorial"
  />
</template>
