import type { TutorialStep } from "~/composables/useTutorialDriver";

export const profileTutorialSteps = (isMobile: boolean): TutorialStep[] => [
  {
    element: "#tutorial-profile-header",
    popover: {
      title: "Bem-vindo à página de Perfil!",
      description:
        "Gerencie suas informações pessoais e configurações da conta. Aqui você pode atualizar seus dados, alterar a senha e configurar preferências do sistema.\n\n💡 Dica: Use as setas do teclado (← →) para navegar entre os passos do tutorial.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#tutorial-profile-tabs",
    popover: {
      title: "Abas de Configuração",
      description:
        "Use as abas para navegar entre diferentes seções: Informações Pessoais, Segurança (senha), Avatar e outras configurações da conta.",
      side: "bottom",
      align: "center",
    },
  },
];

