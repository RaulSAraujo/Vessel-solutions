import type { TutorialStep } from "~/composables/useTutorialDriver";

export const quotationHistoryTutorialSteps = (isMobile: boolean): TutorialStep[] => [
  {
    element: "#tutorial-quotation-history-header",
    popover: {
      title: "Bem-vindo à página de Histórico de Cotações!",
      description:
        "Analise o histórico de cotações unitárias e a variação de preços de fornecedores. Use o filtro de período no topo para visualizar dados de diferentes intervalos de tempo.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#tutorial-quotation-history-info",
    popover: {
      title: "Sobre Cotações Unitárias",
      description:
        "Cada cotação representa o preço por unidade de um ingrediente específico. O valor total é igual ao preço por unidade cotado pelo fornecedor.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#tutorial-quotation-history-overview",
    popover: {
      title: "Visão Geral",
      description:
        "Visualize os principais indicadores do histórico de cotações: número total de cotações, variação média de preços e fornecedores mais utilizados.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#tutorial-quotation-history-chart",
    popover: {
      title: "Gráfico de Tendência de Preços",
      description:
        "Analise a variação de preços ao longo do tempo através de gráficos interativos. Identifique tendências de aumento ou redução de preços para planejamento financeiro.",
      side: "top",
      align: "center",
    },
  },
  {
    element: "#tutorial-quotation-history-insights",
    popover: {
      title: "Insights e Análises",
      description:
        "Receba insights automáticos sobre variações de preços, melhores fornecedores e recomendações para otimizar custos.",
      side: isMobile ? "bottom" : "left",
      align: "center",
    },
  },
  {
    element: "#tutorial-quotation-history-table",
    popover: {
      title: "Tabela Detalhada",
      description:
        "Visualize uma tabela detalhada com todas as cotações históricas, incluindo fornecedores, ingredientes, preços e datas. Use esta tabela para comparar preços e escolher melhores fornecedores.",
      side: "top",
      align: "center",
    },
  },
];

