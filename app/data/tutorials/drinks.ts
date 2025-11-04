import type { TutorialStep } from "~/composables/useTutorialDriver";

export const drinksTutorialSteps = (isMobile: boolean): TutorialStep[] => [
  {
    element: "#tutorial-drinks-header",
    popover: {
      title: "Bem-vindo à página de Bebidas!",
      description:
        "Gerencie o catálogo completo de bebidas do seu negócio. Aqui você pode cadastrar, editar e visualizar todas as bebidas disponíveis, incluindo seus ingredientes e receitas.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#tutorial-drinks-btn-filter",
    popover: {
      title: "Botão de Filtro",
      description:
        "Use este botão para aplicar filtros na tabela de bebidas. Você pode filtrar por nome, descrição, preço e outros critérios para encontrar bebidas específicas.",
      side: isMobile ? "bottom" : "left",
      align: "center",
    },
  },
  {
    element: "#tutorial-drinks-btn-refresh",
    popover: {
      title: "Botão de Atualizar",
      description:
        "Clique neste botão para atualizar a lista de bebidas, buscando os dados mais recentes do servidor.",
      side: isMobile ? "bottom" : "left",
      align: "center",
    },
  },
  {
    element: "#tutorial-drinks-btn-create",
    popover: {
      title: "Botão de Criar",
      description:
        "Use este botão para criar uma nova bebida. Um formulário será aberto onde você pode cadastrar a bebida com seus ingredientes e receita. Certifique-se de cadastrar os ingredientes necessários antes de criar uma nova bebida.",
      side: isMobile ? "bottom" : "left",
      align: "center",
    },
  },
  {
    element: "#tutorial-drinks-table",
    popover: {
      title: "Tabela de Bebidas",
      description:
        "Visualize todas as bebidas cadastradas com informações sobre ingredientes, preços e detalhes.",
      side: "top",
      align: "center",
    },
  },
  {
    element: "#tutorial-drinks-actions-icon",
    popover: {
      title: "Botões de Ação",
      description:
        "Cada linha da tabela possui um botão de ações (ícone de três pontos). Clique nele para ver as opções disponíveis: Editar e Excluir. Use essas ações para gerenciar suas bebidas.",
      side: isMobile ? "bottom" : "right",
      align: "center",
    },
  },
];

