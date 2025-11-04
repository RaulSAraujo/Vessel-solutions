import type { TutorialStep } from "~/composables/useTutorialDriver";

export const dashboardTutorialSteps = (isMobile: boolean): TutorialStep[] => [
  {
    element: "#tutorial-header-period",
    popover: {
      title: "Bem-vindo ao Dashboard!",
      description:
        "Esta é a página principal do sistema. Aqui você pode ver uma visão geral completa do seu negócio de coquetelaria. Use o filtro de período no topo para visualizar dados de diferentes intervalos de tempo.\n\n💡 Dica: Use as setas do teclado (← →) para navegar entre os passos do tutorial.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#tutorial-kpi-section",
    popover: {
      title: "KPIs Principais",
      description:
        "Estes cards mostram os principais indicadores do seu negócio: número de eventos, lucro bruto, clientes cadastrados e bebidas disponíveis. Eles são atualizados automaticamente conforme o período selecionado.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#tutorial-quick-actions",
    popover: {
      title: "Ações Rápidas",
      description:
        "Acesse rapidamente as principais funcionalidades do sistema: criar eventos, adicionar clientes, cadastrar bebidas ou gerar cotações. Clique em qualquer ação para ir direto à página correspondente.",
      side: isMobile ? "bottom" : "left",
      align: "center",
    },
  },
  {
    element: "#tutorial-charts-section",
    popover: {
      title: "Gráficos e Análises",
      description:
        "Visualize gráficos detalhados sobre seus eventos mensais, resumo de lucros e tendências. Use esses dados para tomar decisões estratégicas sobre seu negócio.",
      side: "top",
      align: "center",
    },
  },
  {
    element: "#tutorial-recent-activity",
    popover: {
      title: "Atividades Recentes",
      description:
        "Acompanhe as últimas ações realizadas no sistema, como eventos criados, cotações geradas e outras atividades importantes.",
      side: isMobile ? "bottom" : "left",
      align: "center",
    },
  },
  {
    element: "#tutorial-top-clients",
    popover: {
      title: "Top Clientes",
      description:
        "Veja quais são os seus principais clientes baseado no período selecionado. Esta seção mostra os clientes que mais geraram eventos ou receitas para o seu negócio.",
      side: isMobile ? "bottom" : "left",
      align: "center",
    },
  },
];

