import type { TutorialStep } from "~/composables/useTutorialDriver";

export const clientsTutorialSteps = (isMobile: boolean): TutorialStep[] => [
  {
    element: "#tutorial-clients-header",
    popover: {
      title: "Bem-vindo à página de Clientes!",
      description:
        "Aqui você pode gerenciar todos os seus clientes. Esta página permite visualizar, criar, editar e excluir clientes cadastrados no sistema.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#tutorial-clients-btn-filter",
    popover: {
      title: "Botão de Filtro",
      description:
        "Use este botão para aplicar filtros na tabela de clientes. Você pode filtrar por nome, email, cidade, estado e outros critérios para encontrar clientes específicos.",
      side: isMobile ? "bottom" : "left",
      align: "center",
    },
  },
  {
    element: "#tutorial-clients-btn-refresh",
    popover: {
      title: "Botão de Atualizar",
      description:
        "Clique neste botão para atualizar a lista de clientes, buscando os dados mais recentes do servidor.",
      side: isMobile ? "bottom" : "left",
      align: "center",
    },
  },
  {
    element: "#tutorial-clients-btn-create",
    popover: {
      title: "Botão de Criar",
      description:
        "Use este botão para criar um novo cliente. Um formulário será aberto onde você pode preencher todas as informações do cliente.",
      side: isMobile ? "bottom" : "left",
      align: "center",
    },
  },
  {
    element: "#tutorial-clients-table",
    popover: {
      title: "Tabela de Clientes",
      description:
        "Visualize todos os seus clientes em uma tabela organizada. Você pode ordenar e buscar clientes específicos.",
      side: "top",
      align: "center",
    },
  },
  {
    element: "#tutorial-clients-actions-icon",
    popover: {
      title: "Botões de Ação",
      description:
        "Cada linha da tabela possui um botão de ações (ícone de três pontos). Clique nele para ver as opções disponíveis: Editar e Excluir. Use essas ações para gerenciar seus clientes.",
      side: isMobile ? "bottom" : "right",
      align: "center",
    },
  },
];

