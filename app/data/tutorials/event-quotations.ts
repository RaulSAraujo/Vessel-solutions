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
    element: "#tutorial-event-quotations-form",
    popover: {
      title: "Formulário de Criação de Proposta/Orçamento",
      description:
        "Este é o formulário para criar uma proposta ou orçamento para um cliente. Vamos percorrer cada seção passo a passo.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#tutorial-event-quotations-form-client-name",
    popover: {
      title: "Nome do Cliente",
      description:
        "Digite o nome completo do cliente para quem esta proposta será enviada. Este campo é obrigatório.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-event-quotations-form-client-email",
    popover: {
      title: "E-mail do Cliente",
      description:
        "Informe o e-mail de contato do cliente. Este campo é opcional, mas recomendado para envio da proposta.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-event-quotations-form-client-phone",
    popover: {
      title: "Telefone do Cliente",
      description:
        "Informe o número de telefone de contato do cliente. O formato será aplicado automaticamente. Este campo é obrigatório.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-event-quotations-form-location",
    popover: {
      title: "Endereço do Evento",
      description:
        "Informe o endereço completo onde o evento será realizado. Este campo é obrigatório.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-event-quotations-form-start-time",
    popover: {
      title: "Data e Hora de Início",
      description:
        "Informe a data e hora de início do evento no formato DD/MM/YYYY HH:mm. Este campo é obrigatório.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-event-quotations-form-end-time",
    popover: {
      title: "Data e Hora de Término",
      description:
        "Informe a data e hora de término do evento no formato DD/MM/YYYY HH:mm. O sistema calculará automaticamente a duração do evento. Este campo é obrigatório.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-event-quotations-form-guests",
    popover: {
      title: "Número de Convidados",
      description:
        "Informe o número estimado de convidados do evento. Este valor será usado para calcular a quantidade de bebidas necessárias. Este campo é obrigatório.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-event-quotations-form-audience",
    popover: {
      title: "Perfil do Público",
      description:
        "Selecione o perfil do público do evento (casual, corporativo ou premium). Esta informação ajuda a calcular a distribuição de bebidas. Este campo é obrigatório.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-event-quotations-form-status",
    popover: {
      title: "Status da Proposta",
      description:
        "Selecione o status inicial da proposta. Os status disponíveis incluem: Pendente, Enviada, Aprovada, Rejeitada, etc. Este campo é opcional.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-event-quotations-form-notes",
    popover: {
      title: "Observações",
      description:
        "Digite observações ou informações adicionais sobre a proposta. Este campo é opcional e pode ser usado para anotações, requisitos especiais ou qualquer informação relevante para o cliente.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-event-quotations-form-num-bartenders",
    popover: {
      title: "Número de Bartenders",
      description:
        "Informe quantos bartenders serão necessários para o evento. Este valor será usado no cálculo de custos de equipe na proposta.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-event-quotations-form-bartender-hourly-rate",
    popover: {
      title: "Taxa Horária do Bartender",
      description:
        "Informe o valor da taxa horária de cada bartender em reais (R$). O sistema calculará automaticamente o custo total dos bartenders multiplicando pela quantidade, taxa horária e duração do evento.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-event-quotations-form-num-helpers",
    popover: {
      title: "Número de Ajudantes",
      description:
        "Informe quantos ajudantes serão necessários para o evento. Este valor será usado no cálculo de custos de equipe na proposta.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-event-quotations-form-helper-hourly-rate",
    popover: {
      title: "Taxa Horária dos Ajudantes",
      description:
        "Informe o valor da taxa horária de cada ajudante em reais (R$). O sistema calculará automaticamente o custo total dos ajudantes multiplicando pela quantidade, taxa horária e duração do evento.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-event-quotations-form-distance",
    popover: {
      title: "Distância em Quilômetros",
      description:
        "Informe a distância em quilômetros (km) até o local do evento. Este valor será usado no cálculo de custos de combustível na proposta.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-event-quotations-form-fuel-cost",
    popover: {
      title: "Custo de Combustível por Km",
      description:
        "Informe o custo de combustível por quilômetro em reais (R$). O sistema calculará automaticamente o custo total de combustível multiplicando pela distância informada.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-event-quotations-form-find-drink",
    popover: {
      title: "Adicionar Bebidas",
      description:
        "Após preencher os campos anteriores, você poderá adicionar bebidas à proposta. Busque e selecione as bebidas que serão servidas. O campo ficará habilitado após preencher localização, datas, convidados e perfil do público.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-event-quotations-form-drinks-table",
    popover: {
      title: "Tabela de Bebidas",
      description:
        "Aqui você verá todas as bebidas adicionadas à proposta. Para cada bebida, defina a porcentagem de distribuição (a soma de todas as porcentagens deve ser exatamente 100%). O sistema calculará automaticamente custos, receitas e margem de lucro. Adicione pelo menos uma bebida antes de salvar.",
      side: "top",
      align: "center",
    },
  },
  {
    element: "#tutorial-event-quotations-form-submit",
    popover: {
      title: "Botão Salvar",
      description:
        "Após preencher todos os campos obrigatórios e adicionar pelo menos uma bebida com porcentagem definida (soma totalizando 100%), clique neste botão para salvar a proposta. Após criar, você pode converter a proposta em um evento confirmado quando aprovada pelo cliente.",
      side: "top",
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

