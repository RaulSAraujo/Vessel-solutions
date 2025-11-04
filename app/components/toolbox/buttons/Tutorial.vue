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
  } else if (routePath === "/clients") {
    const { clientsTutorialSteps } = await import(
      "~/data/tutorials/clients"
    );
    steps = clientsTutorialSteps(mobile.value);
  } else if (routePath === "/drinks") {
    const { drinksTutorialSteps } = await import(
      "~/data/tutorials/drinks"
    );
    steps = drinksTutorialSteps(mobile.value);
  } else if (routePath === "/events") {
    const { eventsTutorialSteps } = await import(
      "~/data/tutorials/events"
    );
    steps = eventsTutorialSteps(mobile.value);
  } else if (routePath === "/quotations") {
    const { quotationsTutorialSteps } = await import(
      "~/data/tutorials/quotations"
    );
    steps = quotationsTutorialSteps(mobile.value);
  } else if (routePath === "/suppliers") {
    const { suppliersTutorialSteps } = await import(
      "~/data/tutorials/suppliers"
    );
    steps = suppliersTutorialSteps(mobile.value);
  } else if (routePath === "/ingredients") {
    const { ingredientsTutorialSteps } = await import(
      "~/data/tutorials/ingredients"
    );
    steps = ingredientsTutorialSteps(mobile.value);
  } else if (routePath === "/event-quotations") {
    const { eventQuotationsTutorialSteps } = await import(
      "~/data/tutorials/event-quotations"
    );
    steps = eventQuotationsTutorialSteps(mobile.value);
  } else if (routePath === "/purchase-list") {
    const { purchaseListTutorialSteps } = await import(
      "~/data/tutorials/purchase-list"
    );
    steps = purchaseListTutorialSteps(mobile.value);
  } else if (routePath === "/profitability") {
    const { profitabilityTutorialSteps } = await import(
      "~/data/tutorials/profitability"
    );
    steps = profitabilityTutorialSteps(mobile.value);
  } else if (routePath === "/quotation-history") {
    const { quotationHistoryTutorialSteps } = await import(
      "~/data/tutorials/quotation-history"
    );
    steps = quotationHistoryTutorialSteps(mobile.value);
  } else if (routePath === "/ingredient-consumption") {
    const { ingredientConsumptionTutorialSteps } = await import(
      "~/data/tutorials/ingredient-consumption"
    );
    steps = ingredientConsumptionTutorialSteps(mobile.value);
  } else if (routePath === "/profile") {
    const { profileTutorialSteps } = await import(
      "~/data/tutorials/profile"
    );
    steps = profileTutorialSteps(mobile.value);
  }

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
