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
  const startTutorial = (steps: TutorialStep[]) => {
    if (!process.client) return;

    // Limpar instância anterior se existir
    if (driverInstance) {
      driverInstance.destroy();
      driverInstance = null;
    }

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
      onDestroyed: () => {
        // Marcar como completado quando o tutorial é destruído
        if (process.client) {
          localStorage.setItem(tutorialCompletedKey, 'true');
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
  const restartTutorial = (steps: TutorialStep[]) => {
    if (process.client) {
      localStorage.removeItem(tutorialCompletedKey);
    }
    startTutorial(steps);
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

