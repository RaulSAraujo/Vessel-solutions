import type { TutorialStep } from "~/composables/useTutorialDriver";

export const suppliersTutorialSteps = (isMobile: boolean): TutorialStep[] => [
  {
    element: "#tutorial-suppliers-header",
    popover: {
      title: "Bem-vindo à página de Fornecedores!",
      description:
        "Gerencie todos os fornecedores de ingredientes. Aqui você pode cadastrar novos fornecedores, editar informações de contato e visualizar todos os fornecedores cadastrados.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#tutorial-suppliers-btn-filter",
    popover: {
      title: "Botão de Filtro",
      description:
        "Use este botão para aplicar filtros na tabela de fornecedores. Você pode filtrar por nome, email, telefone e outros critérios para encontrar fornecedores específicos.",
      side: isMobile ? "bottom" : "left",
      align: "center",
    },
  },
  {
    element: "#tutorial-suppliers-btn-refresh",
    popover: {
      title: "Botão de Atualizar",
      description:
        "Clique neste botão para atualizar a lista de fornecedores, buscando os dados mais recentes do servidor.",
      side: isMobile ? "bottom" : "left",
      align: "center",
    },
  },
  {
    element: "#tutorial-suppliers-btn-create",
    popover: {
      title: "Botão de Criar",
      description:
        "Use este botão para criar um novo fornecedor. Um formulário será aberto onde você pode preencher todas as informações de contato. Certifique-se de cadastrar fornecedores antes de criar cotações.",
      side: isMobile ? "bottom" : "left",
      align: "center",
    },
  },
  {
    element: "#tutorial-suppliers-table",
    popover: {
      title: "Tabela de Fornecedores",
      description:
        "Visualize todos os fornecedores com informações de contato, endereço e detalhes.",
      side: "top",
      align: "center",
    },
  },
  {
    element: "#tutorial-suppliers-actions-icon",
    popover: {
      title: "Botões de Ação",
      description:
        "Cada linha da tabela possui um botão de ações (ícone de três pontos). Clique nele para ver as opções disponíveis: Editar e Excluir. Use essas ações para gerenciar seus fornecedores.",
      side: isMobile ? "bottom" : "right",
      align: "center",
    },
  },
];

