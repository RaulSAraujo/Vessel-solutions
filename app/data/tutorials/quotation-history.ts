import type { TutorialStep } from "~/composables/useTutorialDriver";

export const quotationHistoryTutorialSteps = (isMobile: boolean): TutorialStep[] => [
  {
    element: "#tutorial-quotation-history-header",
    popover: {
      title: "Bem-vindo à página de Histórico de Cotações!",
      description:
        "Analise o histórico de cotações unitárias e a variação de preços de fornecedores. Use o filtro de período no topo para visualizar dados de diferentes intervalos de tempo.\n\n💡 Dica: Use as setas do teclado (← →) para navegar entre os passos do tutorial.",
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

