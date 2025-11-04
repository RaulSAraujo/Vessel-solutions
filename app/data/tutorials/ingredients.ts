import type { TutorialStep } from "~/composables/useTutorialDriver";

export const ingredientsTutorialSteps = (isMobile: boolean): TutorialStep[] => [
  {
    element: "#tutorial-ingredients-header",
    popover: {
      title: "Bem-vindo à página de Ingredientes!",
      description:
        "Gerencie todos os ingredientes utilizados nas suas bebidas. Aqui você pode cadastrar novos ingredientes, editar informações, vincular cotações e visualizar o estoque.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#tutorial-ingredients-btn-filter",
    popover: {
      title: "Botão de Filtro",
      description:
        "Use este botão para aplicar filtros na tabela de ingredientes. Você pode filtrar por nome, unidade de medida e outros critérios para encontrar ingredientes específicos.",
      side: isMobile ? "bottom" : "left",
      align: "center",
    },
  },
  {
    element: "#tutorial-ingredients-btn-refresh",
    popover: {
      title: "Botão de Atualizar",
      description:
        "Clique neste botão para atualizar a lista de ingredientes, buscando os dados mais recentes do servidor.",
      side: isMobile ? "bottom" : "left",
      align: "center",
    },
  },
  {
    element: "#tutorial-ingredients-btn-create",
    popover: {
      title: "Botão de Criar",
      description:
        "Use este botão para criar um novo ingrediente. Um formulário será aberto onde você pode cadastrar o ingrediente com suas especificações. Ingredientes são essenciais para criar bebidas.",
      side: isMobile ? "bottom" : "left",
      align: "center",
    },
  },
  {
    element: "#tutorial-ingredients-table",
    popover: {
      title: "Tabela de Ingredientes",
      description:
        "Visualize todos os ingredientes cadastrados com informações sobre unidades de medida, cotações vinculadas e detalhes.",
      side: "top",
      align: "center",
    },
  },
  {
    element: "#tutorial-ingredients-actions-icon",
    popover: {
      title: "Botões de Ação",
      description:
        "Cada linha da tabela possui um botão de ações (ícone de três pontos). Clique nele para ver as opções disponíveis: Editar, Excluir e Selecionar Cotação. Use essas ações para gerenciar seus ingredientes e vincular cotações.",
      side: isMobile ? "bottom" : "right",
      align: "center",
    },
  },
];

