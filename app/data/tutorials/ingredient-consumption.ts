import type { TutorialStep } from "~/composables/useTutorialDriver";

export const ingredientConsumptionTutorialSteps = (isMobile: boolean): TutorialStep[] => [
  {
    element: "#tutorial-ingredient-consumption-header",
    popover: {
      title: "Bem-vindo à página de Consumo de Ingredientes!",
      description:
        "Analise o consumo e utilização de ingredientes nos eventos. Use o filtro de período no topo para visualizar dados de diferentes intervalos de tempo.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#tutorial-ingredient-consumption-overview",
    popover: {
      title: "Visão Geral",
      description:
        "Visualize os principais indicadores de consumo: ingredientes mais utilizados, quantidade total consumida e média de consumo por evento.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#tutorial-ingredient-consumption-chart",
    popover: {
      title: "Gráfico de Consumo",
      description:
        "Analise o consumo de ingredientes ao longo do tempo através de gráficos interativos. Identifique padrões de consumo e planeje melhor suas compras.",
      side: "top",
      align: "center",
    },
  },
  {
    element: "#tutorial-ingredient-consumption-insights",
    popover: {
      title: "Insights e Análises",
      description:
        "Receba insights automáticos sobre consumo de ingredientes, incluindo ingredientes mais utilizados, previsões de consumo e recomendações de estoque.",
      side: isMobile ? "bottom" : "left",
      align: "center",
    },
  },
  {
    element: "#tutorial-ingredient-consumption-table",
    popover: {
      title: "Tabela Detalhada",
      description:
        "Visualize uma tabela detalhada com informações sobre consumo de cada ingrediente por evento, incluindo quantidades e custos. Use esta tabela para otimizar o uso de ingredientes.",
      side: "top",
      align: "center",
    },
  },
];

