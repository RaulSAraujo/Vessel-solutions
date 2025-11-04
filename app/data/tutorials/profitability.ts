import type { TutorialStep } from "~/composables/useTutorialDriver";

export const profitabilityTutorialSteps = (isMobile: boolean): TutorialStep[] => [
  {
    element: "#tutorial-profitability-header",
    popover: {
      title: "Bem-vindo à página de Lucratividade!",
      description:
        "Analise a lucratividade e performance financeira dos seus eventos. Use o filtro de período no topo para visualizar dados de diferentes intervalos de tempo.\n\n💡 Dica: Use as setas do teclado (← →) para navegar entre os passos do tutorial.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#tutorial-profitability-overview",
    popover: {
      title: "Visão Geral",
      description:
        "Visualize os principais indicadores de lucratividade: margem de lucro, receita total, custos e lucro líquido. Esses valores são atualizados conforme o período selecionado.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#tutorial-profitability-chart",
    popover: {
      title: "Gráfico de Tendência",
      description:
        "Analise a tendência de lucratividade ao longo do tempo através de gráficos interativos. Identifique períodos de maior ou menor lucro para tomar decisões estratégicas.",
      side: "top",
      align: "center",
    },
  },
  {
    element: "#tutorial-profitability-insights",
    popover: {
      title: "Insights e Análises",
      description:
        "Receba insights automáticos sobre a performance financeira dos eventos, incluindo recomendações e alertas sobre oportunidades de melhoria.",
      side: isMobile ? "bottom" : "left",
      align: "center",
    },
  },
  {
    element: "#tutorial-profitability-table",
    popover: {
      title: "Tabela Detalhada",
      description:
        "Visualize uma tabela detalhada com informações sobre cada evento, incluindo custos, receitas e lucro individual. Use esta tabela para identificar eventos mais ou menos lucrativos.",
      side: "top",
      align: "center",
    },
  },
  {
    element: "#tutorial-table-total",
    popover: {
      title: "Total de Registros",
      description:
        "Este chip mostra o total de registros disponíveis na tabela. Ele é atualizado automaticamente conforme os filtros aplicados.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#tutorial-table-items-per-page",
    popover: {
      title: "Itens por Página",
      description:
        "Use este seletor para escolher quantos itens você deseja visualizar por página. As opções disponíveis são: 10, 25 ou 50 itens. Isso ajuda a navegar melhor em tabelas com muitos registros.",
      side: "top",
      align: "center",
    },
  },
  {
    element: "#tutorial-table-pagination",
    popover: {
      title: "Paginação",
      description:
        "Use os botões de navegação para percorrer as páginas da tabela. Clique nos números para ir diretamente para uma página específica ou use as setas para avançar/retroceder. A paginação é atualizada automaticamente quando você altera a quantidade de itens por página.",
      side: "top",
      align: "center",
    },
  },
];

