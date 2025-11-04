import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export interface TutorialStep {
  element: string; // seletor CSS
  popover: {
    title: string;
    description: string;
    side?: 'top' | 'bottom' | 'left' | 'right';
    align?: 'start' | 'center' | 'end';
  };
}

export const useTutorialDriver = () => {
  let driverInstance: ReturnType<typeof driver> | null = null;
  const tutorialCompletedKey = 'tutorial_completed';

  // Verificar se o tutorial já foi completado
  const isTutorialCompleted = () => {
    if (process.client) {
      return localStorage.getItem(tutorialCompletedKey) === 'true';
    }
    return false;
  };

  // Iniciar tutorial
  const startTutorial = (
    steps: TutorialStep[],
    onStepHighlighted?: (stepIndex: number, element: HTMLElement | null) => void | Promise<void>,
    onDestroyed?: () => void | Promise<void>,
    onStepLeft?: (stepIndex: number) => void | Promise<void>
  ) => {
    if (!process.client) return;

    // Limpar instância anterior se existir
    if (driverInstance) {
      driverInstance.destroy();
      driverInstance = null;
    }

    // Rastrear o passo anterior para detectar quando sair do formulário
    let previousStepIndex: number | null = null;
    let currentStepIndex: number | null = null;

    // Configurar Driver.js
    driverInstance = driver({
      showProgress: true,
      showButtons: ['next', 'previous', 'close'],
      steps: steps.map((step) => ({
        element: step.element,
        popover: {
          title: step.popover.title,
          description: step.popover.description,
          side: step.popover.side || 'bottom',
          align: step.popover.align || 'center',
        },
      })),
      onHighlighted: async (element, step) => {
        // Executar callback quando um step é destacado
        if (onStepHighlighted && step) {
          // Encontrar o índice do step atual comparando com os steps
          const stepIndex = steps.findIndex((s) => s.element === step.element);
          if (stepIndex === -1) return;
          
          const htmlElement = element ? (element as HTMLElement) : null;
          const currentStep = steps[stepIndex];
          
          // Verificar se estamos saindo do passo do formulário
          // Comparar o passo atual (currentStepIndex) com o novo passo (stepIndex)
          if (currentStepIndex !== null && onStepLeft) {
            const previousStep = steps[currentStepIndex];
            // Se o passo atual (antes da atualização) era um formulário e o novo passo não é, fechar o dialog
            if (previousStep && previousStep.element.includes('-form') && 
                currentStep && !currentStep.element.includes('-form')) {
              await onStepLeft(currentStepIndex);
              // Aguardar um pouco para o dialog fechar
              await new Promise((resolve) => setTimeout(resolve, 200));
            }
          }
          
          // Se é o passo do formulário, verificar se o elemento existe no DOM
          if (currentStep && currentStep.element.includes('-form') && !htmlElement) {
            // Elemento não existe, abrir dialog primeiro
            await onStepHighlighted(stepIndex, htmlElement);
            
            // Aguardar o elemento aparecer no DOM (polling)
            let attempts = 0;
            const maxAttempts = 20;
            while (attempts < maxAttempts) {
              await new Promise((resolve) => setTimeout(resolve, 100));
              const formElement = document.querySelector(currentStep.element) as HTMLElement;
              if (formElement && driverInstance) {
                // Forçar o driver a destacar novamente (agora com o elemento visível)
                await driverInstance.movePrevious();
                await new Promise((resolve) => setTimeout(resolve, 150));
                await driverInstance.moveNext();
                break;
              }
              attempts++;
            }
          } else {
            // Executar callback normal para outros steps
            await onStepHighlighted(stepIndex, htmlElement);
          }
          
          // Atualizar o passo anterior e atual
          previousStepIndex = currentStepIndex;
          currentStepIndex = stepIndex;
        }
      },
      onDestroyed: async () => {
        // Marcar como completado quando o tutorial é destruído
        if (process.client) {
          localStorage.setItem(tutorialCompletedKey, 'true');
        }
        
        // Executar callback de limpeza (para fechar dialogs, etc)
        if (onDestroyed) {
          await onDestroyed();
        }
        
        // Limpar referência após destruição
        driverInstance = null;
      },
    });

    // Iniciar o tutorial
    driverInstance.drive();
  };

  // Parar tutorial
  const stopTutorial = () => {
    if (driverInstance) {
      driverInstance.destroy();
      driverInstance = null;
    }
  };

  // Reiniciar tutorial (limpar localStorage e iniciar)
  const restartTutorial = (
    steps: TutorialStep[],
    onStepHighlighted?: (stepIndex: number, element: HTMLElement | null) => void | Promise<void>,
    onDestroyed?: () => void | Promise<void>,
    onStepLeft?: (stepIndex: number) => void | Promise<void>
  ) => {
    if (process.client) {
      localStorage.removeItem(tutorialCompletedKey);
    }
    startTutorial(steps, onStepHighlighted, onDestroyed, onStepLeft);
  };

  return {
    isTutorialCompleted,
    startTutorial,
    stopTutorial,
    restartTutorial,
    // Método para limpar ao desmontar (chamar manualmente no onUnmounted do componente)
    destroy: () => {
      if (driverInstance) {
        driverInstance.destroy();
        driverInstance = null;
      }
    },
  };
};

