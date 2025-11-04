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
    element: "#tutorial-events-form",
    popover: {
      title: "Formulário de Criação de Evento",
      description:
        "Este é o formulário para cadastrar um novo evento. Vamos percorrer cada seção passo a passo.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#tutorial-events-form-client",
    popover: {
      title: "Selecionar Cliente",
      description:
        "Busque e selecione o cliente para este evento. Digite o nome do cliente e escolha da lista. Os dados do cliente (nome e telefones) serão preenchidos automaticamente. Este campo é obrigatório.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-events-form-client-name",
    popover: {
      title: "Nome do Cliente",
      description:
        "Este campo exibe o nome completo do cliente selecionado. Ele é preenchido automaticamente e não pode ser editado diretamente.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-events-form-client-phone",
    popover: {
      title: "Telefone do Cliente",
      description:
        "Este campo exibe o telefone principal do cliente selecionado. Ele é preenchido automaticamente e não pode ser editado diretamente.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-events-form-client-phone-optional",
    popover: {
      title: "Telefone Opcional do Cliente",
      description:
        "Este campo exibe o telefone opcional do cliente selecionado, se houver. Ele é preenchido automaticamente e não pode ser editado diretamente.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-events-form-status",
    popover: {
      title: "Status do Evento",
      description:
        "Selecione o status inicial do evento. Os status disponíveis incluem: Pendente, Confirmado, Em Andamento, Concluído, Cancelado, etc. Este campo é opcional.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-events-form-location",
    popover: {
      title: "Endereço do Evento",
      description:
        "Informe o endereço completo onde o evento será realizado. Este campo é obrigatório.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-events-form-start-time",
    popover: {
      title: "Data e Hora de Início",
      description:
        "Informe a data e hora de início do evento no formato DD/MM/YYYY HH:mm. Este campo é obrigatório.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-events-form-end-time",
    popover: {
      title: "Data e Hora de Término",
      description:
        "Informe a data e hora de término do evento no formato DD/MM/YYYY HH:mm. O sistema calculará automaticamente a duração do evento. Este campo é obrigatório.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-events-form-guests",
    popover: {
      title: "Número de Convidados",
      description:
        "Informe o número estimado de convidados do evento. Este valor será usado para calcular a quantidade de bebidas necessárias. Este campo é obrigatório.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-events-form-audience",
    popover: {
      title: "Perfil do Público",
      description:
        "Selecione o perfil do público do evento (ex: corporativo, festa, casamento, etc.). Esta informação ajuda a calcular a distribuição de bebidas. Este campo é obrigatório.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-events-form-notes",
    popover: {
      title: "Observações",
      description:
        "Digite observações ou informações adicionais sobre o evento. Este campo é opcional e pode ser usado para anotações, requisitos especiais ou qualquer informação relevante.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-events-form-num-bartenders",
    popover: {
      title: "Número de Bartenders",
      description:
        "Informe quantos bartenders serão necessários para o evento. Este valor será usado no cálculo de custos de equipe.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-events-form-bartender-hourly-rate",
    popover: {
      title: "Taxa Horária do Bartender",
      description:
        "Informe o valor da taxa horária de cada bartender em reais (R$). O sistema calculará automaticamente o custo total dos bartenders multiplicando pela quantidade, taxa horária e duração do evento.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-events-form-num-helpers",
    popover: {
      title: "Número de Ajudantes",
      description:
        "Informe quantos ajudantes serão necessários para o evento. Este valor será usado no cálculo de custos de equipe.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-events-form-helper-hourly-rate",
    popover: {
      title: "Taxa Horária dos Ajudantes",
      description:
        "Informe o valor da taxa horária de cada ajudante em reais (R$). O sistema calculará automaticamente o custo total dos ajudantes multiplicando pela quantidade, taxa horária e duração do evento.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-events-form-distance",
    popover: {
      title: "Distância em Quilômetros",
      description:
        "Informe a distância em quilômetros (km) até o local do evento. Este valor será usado no cálculo de custos de combustível.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-events-form-fuel-cost",
    popover: {
      title: "Custo de Combustível por Km",
      description:
        "Informe o custo de combustível por quilômetro em reais (R$). O sistema calculará automaticamente o custo total de combustível multiplicando pela distância informada.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-events-form-find-drink",
    popover: {
      title: "Adicionar Bebidas",
      description:
        "Após preencher os campos anteriores, você poderá adicionar bebidas ao evento. Busque e selecione as bebidas que serão servidas. O campo ficará habilitado após preencher cliente, localização, datas, convidados e perfil do público.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tutorial-events-form-drinks-table",
    popover: {
      title: "Tabela de Bebidas",
      description:
        "Aqui você verá todas as bebidas adicionadas ao evento. Para cada bebida, defina a porcentagem de distribuição (a soma de todas as porcentagens deve ser exatamente 100%). O sistema calculará automaticamente custos, receitas e margem de lucro. Adicione pelo menos uma bebida antes de salvar.",
      side: "top",
      align: "center",
    },
  },
  {
    element: "#tutorial-events-form-submit",
    popover: {
      title: "Botão Salvar",
      description:
        "Após preencher todos os campos obrigatórios e adicionar pelo menos uma bebida com porcentagem definida (soma totalizando 100%), clique neste botão para salvar o evento.",
      side: "top",
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

