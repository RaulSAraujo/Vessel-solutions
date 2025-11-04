import type { TutorialStep } from "~/composables/useTutorialDriver";

export const purchaseListTutorialSteps = (isMobile: boolean): TutorialStep[] => [
  {
    element: "#tutorial-purchase-list-header",
    popover: {
      title: "Bem-vindo à página de Lista de Compras!",
      description:
        "Visualize e gerencie a lista de compras gerada automaticamente para eventos. Esta lista é atualizada automaticamente quando um evento é marcado como 'Comprar'.\n\n💡 Dica: Use as setas do teclado (← →) para navegar entre os passos do tutorial.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#tutorial-purchase-list-info",
    popover: {
      title: "Informação Importante",
      description:
        "Os itens da lista de compras são gerados e atualizados automaticamente quando um evento é alterado para status 'Comprar'. Você pode apenas alterar o status dos itens (Pendente, Comprado, Cancelado).",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#tutorial-purchase-list-summary",
    popover: {
      title: "Resumo da Lista",
      description:
        "Visualize um resumo da lista de compras com informações sobre quantidade total de itens, valor total estimado e status dos itens.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#tutorial-purchase-list-table",
    popover: {
      title: "Tabela de Itens",
      description:
        "Visualize todos os itens da lista de compras com informações sobre ingredientes, quantidades, fornecedores e status. Use os checkboxes na primeira coluna para selecionar itens específicos.",
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
  {
    element: "#tutorial-purchase-list-btn-bulk-actions",
    popover: {
      title: "Botão de Ações em Lote",
      description:
        "Quando você seleciona um ou mais itens usando os checkboxes, este botão aparece automaticamente. Clique nele para abrir o menu de ações em lote, onde você pode atualizar o status de múltiplos itens de uma vez (Pendente, Comprado ou Cancelado), facilitando o gerenciamento da lista de compras.",
      side: isMobile ? "bottom" : "left",
      align: "center",
    },
  },
];

