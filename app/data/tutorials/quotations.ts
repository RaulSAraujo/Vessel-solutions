import type { TutorialStep } from "~/composables/useTutorialDriver";

export const quotationsTutorialSteps = (isMobile: boolean): TutorialStep[] => [
  {
    element: "#tutorial-quotations-header",
    popover: {
      title: "Bem-vindo à página de Cotações!",
      description:
        "Gerencie cotações de ingredientes com fornecedores. Esta página permite criar cotações unitárias, comparar preços de diferentes fornecedores e vincular cotações aos ingredientes.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#tutorial-quotations-btn-filter",
    popover: {
      title: "Botão de Filtro",
      description:
        "Use este botão para aplicar filtros na tabela de cotações. Você pode filtrar por fornecedor, ingrediente, preço e outros critérios para encontrar cotações específicas ou comparar preços.",
      side: isMobile ? "bottom" : "left",
      align: "center",
    },
  },
  {
    element: "#tutorial-quotations-btn-refresh",
    popover: {
      title: "Botão de Atualizar",
      description:
        "Clique neste botão para atualizar a lista de cotações, buscando os dados mais recentes do servidor.",
      side: isMobile ? "bottom" : "left",
      align: "center",
    },
  },
  {
    element: "#tutorial-quotations-btn-create",
    popover: {
      title: "Botão de Criar",
      description:
        "Use este botão para criar uma nova cotação. Um formulário será aberto onde você pode cadastrar uma cotação vinculando um fornecedor a um ingrediente. Após criar uma cotação, você pode vinculá-la diretamente a um ingrediente.",
      side: isMobile ? "bottom" : "left",
      align: "center",
    },
  },
  {
    element: "#tutorial-quotations-table",
    popover: {
      title: "Tabela de Cotações",
      description:
        "Visualize todas as cotações cadastradas com informações sobre fornecedores, ingredientes, preços e unidades.",
      side: "top",
      align: "center",
    },
  },
  {
    element: "#tutorial-quotations-actions-icon",
    popover: {
      title: "Botões de Ação",
      description:
        "Cada linha da tabela possui um botão de ações (ícone de três pontos). Clique nele para ver as opções disponíveis: Editar e Excluir. Use essas ações para gerenciar suas cotações.",
      side: isMobile ? "bottom" : "right",
      align: "center",
    },
  },
];

