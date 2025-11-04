<script lang="ts" setup>
import ToolboxButton from "./Button.vue";
import type { TutorialStep } from "~/composables/useTutorialDriver";

// Tutorial
const tutorial = useTutorialDriver();
const { mobile } = useDisplay();
const route = useRoute();

// Função helper para fechar dialogs/bottom-sheets
const closeDialogHelper = async () => {
  await nextTick();
  
  // 1. Tentar clicar no backdrop
  const backdrop = document.querySelector('.v-overlay__scrim') as HTMLElement;
  if (backdrop) {
    backdrop.click();
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  
  // 2. Tentar encontrar e clicar no botão de fechar
  const closeBtn = document.querySelector('.v-bottom-sheet .v-btn[aria-label*="close"], .v-bottom-sheet [aria-label="Close"], .v-dialog .v-btn[aria-label*="close"]') as HTMLElement;
  if (closeBtn) {
    closeBtn.click();
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  
  // 3. Simular evento ESC
  const escEvent = new KeyboardEvent('keydown', { 
    key: 'Escape', 
    code: 'Escape',
    keyCode: 27,
    bubbles: true,
    cancelable: true
  });
  document.dispatchEvent(escEvent);
  window.dispatchEvent(escEvent);
  
  // 4. Tentar encontrar o componente Vue e atualizar o modelValue
  const bottomSheet = document.querySelector('.v-bottom-sheet') as any;
  if (bottomSheet) {
    // Tentar encontrar a instância Vue
    const vueInstance = bottomSheet.__vueParentComponent || bottomSheet.__vue_app__;
    if (vueInstance) {
      // Tentar atualizar via props ou emit
      try {
        if (vueInstance.props && typeof vueInstance.props.modelValue !== 'undefined') {
          vueInstance.emit?.('update:modelValue', false);
        }
      } catch (e) {
        // Ignorar erros
      }
    }
  }
  
  const dialog = document.querySelector('.v-dialog') as any;
  if (dialog) {
    const vueInstance = dialog.__vueParentComponent || dialog.__vue_app__;
    if (vueInstance) {
      try {
        if (vueInstance.props && typeof vueInstance.props.modelValue !== 'undefined') {
          vueInstance.emit?.('update:modelValue', false);
        }
      } catch (e) {
        // Ignorar erros
      }
    }
  }
};

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
    
    // Abrir dialog quando chegar no passo do formulário
    const onStepHighlighted = async (stepIndex: number, element: HTMLElement | null) => {
      const step = steps?.[stepIndex];
      if (step?.element === '#tutorial-clients-form') {
        // Se o elemento não existe, abrir o dialog
        if (!element) {
          const createButton = document.querySelector('#tutorial-clients-btn-create') as HTMLElement;
          if (createButton) {
            createButton.click();
            await nextTick();
            await new Promise((resolve) => setTimeout(resolve, 300));
          }
        }
      }
    };
    
    // Fechar dialog quando sair do passo do formulário
    const onStepLeft = async (stepIndex: number) => {
      const step = steps?.[stepIndex];
      if (step?.element.includes('-form')) {
        await closeDialogHelper();
      }
    };
    
    const closeDialog = async () => {
      await closeDialogHelper();
    };
    
    if (steps) {
      tutorial.startTutorial(steps, onStepHighlighted, closeDialog, onStepLeft);
      return;
    }
  } else if (routePath === "/drinks") {
    const { drinksTutorialSteps } = await import(
      "~/data/tutorials/drinks"
    );
    steps = drinksTutorialSteps(mobile.value);
    
    const onStepHighlighted = async (stepIndex: number, element: HTMLElement | null) => {
      const step = steps?.[stepIndex];
      if (step?.element === '#tutorial-drinks-form') {
        if (!element) {
          const createButton = document.querySelector('#tutorial-drinks-btn-create') as HTMLElement;
          if (createButton) {
            createButton.click();
            await nextTick();
            await new Promise((resolve) => setTimeout(resolve, 300));
          }
        }
      }
    };
    
    const onStepLeft = async (stepIndex: number) => {
      const step = steps?.[stepIndex];
      if (step?.element.includes('-form')) {
        await closeDialogHelper();
      }
    };
    
    const closeDialog = async () => {
      await closeDialogHelper();
    };
    
    if (steps) {
      tutorial.startTutorial(steps, onStepHighlighted, closeDialog, onStepLeft);
      return;
    }
  } else if (routePath === "/events") {
    const { eventsTutorialSteps } = await import(
      "~/data/tutorials/events"
    );
    steps = eventsTutorialSteps(mobile.value);
    
    const onStepHighlighted = async (stepIndex: number, element: HTMLElement | null) => {
      const step = steps?.[stepIndex];
      if (step?.element === '#tutorial-events-form') {
        if (!element) {
          const createButton = document.querySelector('#tutorial-events-btn-create') as HTMLElement;
          if (createButton) {
            createButton.click();
            await nextTick();
            await new Promise((resolve) => setTimeout(resolve, 300));
          }
        }
      }
    };
    
    const onStepLeft = async (stepIndex: number) => {
      const step = steps?.[stepIndex];
      if (step?.element.includes('-form')) {
        await closeDialogHelper();
      }
    };
    
    const closeDialog = async () => {
      await closeDialogHelper();
    };
    
    if (steps) {
      tutorial.startTutorial(steps, onStepHighlighted, closeDialog, onStepLeft);
      return;
    }
  } else if (routePath === "/quotations") {
    const { quotationsTutorialSteps } = await import(
      "~/data/tutorials/quotations"
    );
    steps = quotationsTutorialSteps(mobile.value);
    
    const onStepHighlighted = async (stepIndex: number, element: HTMLElement | null) => {
      const step = steps?.[stepIndex];
      if (step?.element === '#tutorial-quotations-form') {
        if (!element) {
          const createButton = document.querySelector('#tutorial-quotations-btn-create') as HTMLElement;
          if (createButton) {
            createButton.click();
            await nextTick();
            await new Promise((resolve) => setTimeout(resolve, 300));
          }
        }
      }
    };
    
    const onStepLeft = async (stepIndex: number) => {
      const step = steps?.[stepIndex];
      if (step?.element.includes('-form')) {
        await closeDialogHelper();
      }
    };
    
    const closeDialog = async () => {
      await closeDialogHelper();
    };
    
    if (steps) {
      tutorial.startTutorial(steps, onStepHighlighted, closeDialog, onStepLeft);
      return;
    }
  } else if (routePath === "/suppliers") {
    const { suppliersTutorialSteps } = await import(
      "~/data/tutorials/suppliers"
    );
    steps = suppliersTutorialSteps(mobile.value);
    
    const onStepHighlighted = async (stepIndex: number, element: HTMLElement | null) => {
      const step = steps?.[stepIndex];
      if (step?.element === '#tutorial-suppliers-form') {
        if (!element) {
          const createButton = document.querySelector('#tutorial-suppliers-btn-create') as HTMLElement;
          if (createButton) {
            createButton.click();
            await nextTick();
            await new Promise((resolve) => setTimeout(resolve, 300));
          }
        }
      }
    };
    
    const onStepLeft = async (stepIndex: number) => {
      const step = steps?.[stepIndex];
      if (step?.element.includes('-form')) {
        await closeDialogHelper();
      }
    };
    
    const closeDialog = async () => {
      await closeDialogHelper();
    };
    
    if (steps) {
      tutorial.startTutorial(steps, onStepHighlighted, closeDialog, onStepLeft);
      return;
    }
  } else if (routePath === "/ingredients") {
    const { ingredientsTutorialSteps } = await import(
      "~/data/tutorials/ingredients"
    );
    steps = ingredientsTutorialSteps(mobile.value);
    
    const onStepHighlighted = async (stepIndex: number, element: HTMLElement | null) => {
      const step = steps?.[stepIndex];
      if (step?.element === '#tutorial-ingredients-form') {
        if (!element) {
          const createButton = document.querySelector('#tutorial-ingredients-btn-create') as HTMLElement;
          if (createButton) {
            createButton.click();
            await nextTick();
            await new Promise((resolve) => setTimeout(resolve, 300));
          }
        }
      }
    };
    
    const onStepLeft = async (stepIndex: number) => {
      const step = steps?.[stepIndex];
      if (step?.element.includes('-form')) {
        await closeDialogHelper();
      }
    };
    
    const closeDialog = async () => {
      await closeDialogHelper();
    };
    
    if (steps) {
      tutorial.startTutorial(steps, onStepHighlighted, closeDialog, onStepLeft);
      return;
    }
  } else if (routePath === "/event-quotations") {
    const { eventQuotationsTutorialSteps } = await import(
      "~/data/tutorials/event-quotations"
    );
    steps = eventQuotationsTutorialSteps(mobile.value);
    
    const onStepHighlighted = async (stepIndex: number, element: HTMLElement | null) => {
      const step = steps?.[stepIndex];
      if (step?.element === '#tutorial-event-quotations-form') {
        if (!element) {
          const createButton = document.querySelector('#tutorial-event-quotations-btn-create') as HTMLElement;
          if (createButton) {
            createButton.click();
            await nextTick();
            await new Promise((resolve) => setTimeout(resolve, 300));
          }
        }
      }
    };
    
    const onStepLeft = async (stepIndex: number) => {
      const step = steps?.[stepIndex];
      if (step?.element.includes('-form')) {
        await closeDialogHelper();
      }
    };
    
    const closeDialog = async () => {
      await closeDialogHelper();
    };
    
    if (steps) {
      tutorial.startTutorial(steps, onStepHighlighted, closeDialog, onStepLeft);
      return;
    }
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
