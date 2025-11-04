import type { TutorialStep } from "~/composables/useTutorialDriver";

export const eventQuotationsTutorialSteps = (isMobile: boolean): TutorialStep[] => [
  {
    element: "#tutorial-event-quotations-header",
    popover: {
      title: "Bem-vindo à página de Propostas e Orçamentos!",
      description:
        "Gerencie as propostas e orçamentos gerados para eventos. Aqui você pode criar propostas para clientes, visualizar orçamentos existentes e converter propostas em eventos confirmados.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#tutorial-event-quotations-btn-filter",
    popover: {
      title: "Botão de Filtro",
      description:
        "Use este botão para aplicar filtros na tabela de propostas e orçamentos. Você pode filtrar por cliente, status, data e outros critérios para encontrar propostas específicas.",
      side: isMobile ? "bottom" : "left",
      align: "center",
    },
  },
  {
    element: "#tutorial-event-quotations-btn-refresh",
    popover: {
      title: "Botão de Atualizar",
      description:
        "Clique neste botão para atualizar a lista de propostas e orçamentos, buscando os dados mais recentes do servidor.",
      side: isMobile ? "bottom" : "left",
      align: "center",
    },
  },
  {
    element: "#tutorial-event-quotations-btn-create",
    popover: {
      title: "Botão de Criar",
      description:
        "Use este botão para criar uma nova proposta ou orçamento. Um formulário será aberto onde você pode preencher todas as informações da proposta para o cliente.",
      side: isMobile ? "bottom" : "left",
      align: "center",
    },
  },
  {
    element: "#tutorial-event-quotations-table",
    popover: {
      title: "Tabela de Propostas e Orçamentos",
      description:
        "Visualize todas as propostas e orçamentos com informações sobre eventos, clientes, valores e status.",
      side: "top",
      align: "center",
    },
  },
  {
    element: "#tutorial-event-quotations-actions-icon",
    popover: {
      title: "Botões de Ação",
      description:
        "Cada linha da tabela possui um botão de ações (ícone de três pontos). Clique nele para ver as opções disponíveis: Editar, Excluir e Converter para Evento. Propostas podem ser convertidas em eventos quando aprovadas.",
      side: isMobile ? "bottom" : "right",
      align: "center",
    },
  },
];

