import type { TutorialStep } from "~/composables/useTutorialDriver";

export const eventsTutorialSteps = (isMobile: boolean): TutorialStep[] => [
  {
    element: "#tutorial-events-header",
    popover: {
      title: "Bem-vindo à página de Eventos!",
      description:
        "Gerencie todos os eventos de coquetelaria. Aqui você pode criar novos eventos, visualizar eventos existentes, editar informações e controlar o status de cada evento.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#tutorial-events-btn-filter",
    popover: {
      title: "Botão de Filtro",
      description:
        "Use este botão para aplicar filtros na tabela de eventos. Você pode filtrar por cliente, data, status e outros critérios para encontrar eventos específicos.",
      side: isMobile ? "bottom" : "left",
      align: "center",
    },
  },
  {
    element: "#tutorial-events-btn-refresh",
    popover: {
      title: "Botão de Atualizar",
      description:
        "Clique neste botão para atualizar a lista de eventos, buscando os dados mais recentes do servidor.",
      side: isMobile ? "bottom" : "left",
      align: "center",
    },
  },
  {
    element: "#tutorial-events-btn-create",
    popover: {
      title: "Botão de Criar",
      description:
        "Use este botão para criar um novo evento. Um formulário será aberto onde você pode preencher todas as informações do evento. Lembre-se de associar bebidas e criar cotações para cada evento.",
      side: isMobile ? "bottom" : "left",
      align: "center",
    },
  },
  {
    element: "#tutorial-events-table",
    popover: {
      title: "Tabela de Eventos",
      description:
        "Visualize todos os seus eventos com informações como data, cliente, status e detalhes.",
      side: "top",
      align: "center",
    },
  },
  {
    element: "#tutorial-events-actions-icon",
    popover: {
      title: "Botões de Ação",
      description:
        "Cada linha da tabela possui um botão de ações (ícone de três pontos). Clique nele para ver as opções disponíveis: Editar e Excluir. Use essas ações para gerenciar seus eventos.",
      side: isMobile ? "bottom" : "right",
      align: "center",
    },
  },
];

